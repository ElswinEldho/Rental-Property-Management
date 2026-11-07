import { generateSecureToken, hashToken } from '../../../../core/security/tokens.js';
import { AuthenticationError } from '../../../../core/errors/AppError.js';
import { config } from '../../../../core/config/index.js';
import { runTransaction } from '../../../../core/database/transaction.js';
import { TokenService } from '../services/TokenService.js';
import { logger } from '../../../../core/logger/logger.js';

export class RefreshTokenUseCase {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  /**
   * Rotates a refresh token and generates a new access token.
   * If token reuse is detected, all tokens in the family are revoked immediately.
   *
   * @param {object} params
   * @param {string} params.rawRefreshToken
   * @param {string} [params.ipAddress]
   * @param {string} [params.userAgent]
   * @returns {Promise<{ accessToken: string, refreshToken: string, user: object }>}
   */
  async execute({ rawRefreshToken, ipAddress, userAgent }) {
    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      throw new AuthenticationError('Refresh token is required.');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const existingToken = await this.authRepo.findRefreshTokenByHash(tokenHash);

    if (!existingToken) {
      throw new AuthenticationError('Invalid refresh session.');
    }

    // SECURITY: Token Reuse / Replay Detection
    // If a revoked token is presented, revoke the entire token family outside the failed transaction
    // so the revocation persists even though the refresh request is rejected.
    if (existingToken.isRevoked) {
      logger.warn(
        {
          userId: existingToken.userId,
          familyId: existingToken.familyId,
          generation: existingToken.generation,
        },
        'SECURITY ALERT: Revoked refresh token reuse detected. Invalidating entire token family.'
      );

      await this.authRepo.revokeTokenFamily(existingToken.familyId);
      throw new AuthenticationError('Invalid refresh session. Please log in again.');
    }

    // Check Expiration
    if (new Date() > new Date(existingToken.expiresAt)) {
      await this.authRepo.revokeRefreshTokenByHash(tokenHash);
      throw new AuthenticationError('Refresh session has expired. Please log in again.');
    }

    // Check Account Status
    const user = existingToken.user;
    if (!user || !user.isActive) {
      throw new AuthenticationError('Account is inactive.');
    }

    const roles = user.userRoles.map((ur) => ur.roleId);
    const tenantId = user.tenant?.id || null;

    // Rotate within an atomic database transaction
    return await runTransaction(async (tx) => {
      // Re-verify under transaction lock to prevent race condition replay
      const current = await this.authRepo.findRefreshTokenByHash(tokenHash, tx);
      if (current.isRevoked) {
        await this.authRepo.revokeTokenFamily(current.familyId, tx);
        throw new AuthenticationError('Invalid refresh session. Please log in again.');
      }

      const nextRawToken = generateSecureToken(32);
      const nextTokenHash = hashToken(nextRawToken);

      const nextExpiresAt = new Date();
      nextExpiresAt.setDate(nextExpiresAt.getDate() + config.REFRESH_TOKEN_EXPIRY_DAYS);

      await this.authRepo.rotateRefreshToken(
        tokenHash,
        {
          userId: user.id,
          familyId: existingToken.familyId,
          tokenHash: nextTokenHash,
          generation: existingToken.generation + 1,
          expiresAt: nextExpiresAt,
          ipAddress,
          userAgent,
        },
        tx
      );

      // Issue new access token
      const newAccessToken = TokenService.generateAccessToken({
        userId: user.id,
        email: user.email,
        roles,
        tenantId,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: nextRawToken,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          roles,
          tenantId,
        },
      };
    });
  }
}
