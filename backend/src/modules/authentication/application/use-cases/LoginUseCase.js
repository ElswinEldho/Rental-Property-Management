import { verifyPassword } from '../../../../core/security/password.js';
import { generateSecureToken, hashToken, generateUUID } from '../../../../core/security/tokens.js';
import { AuthenticationError } from '../../../../core/errors/AppError.js';
import { config } from '../../../../core/config/index.js';
import { TokenService } from '../services/TokenService.js';

export class LoginUseCase {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  /**
   * Executes user login for Admin or Tenant.
   *
   * @param {object} params
   * @param {string} params.identifier - Email or phone
   * @param {string} params.password - Plaintext password
   * @param {string} [params.ipAddress]
   * @param {string} [params.userAgent]
   * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
   */
  async execute({ identifier, password, ipAddress, userAgent }) {
    const user = await this.authRepo.findUserByIdentifier(identifier);

    // Generic error message protects against user enumeration
    if (!user) {
      throw new AuthenticationError('Invalid credentials.');
    }

    // Verify password hash
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials.');
    }

    // Check account status
    if (!user.isActive) {
      throw new AuthenticationError('Account has been deactivated. Please contact support.');
    }

    const roles = user.userRoles.map((ur) => ur.roleId);
    const tenantId = user.tenant?.id || null;

    // 1. Issue Access Token
    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      roles,
      tenantId,
    });

    // 2. Issue Refresh Token and establish Token Family
    const rawRefreshToken = generateSecureToken(32);
    const tokenHash = hashToken(rawRefreshToken);
    const familyId = generateUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.REFRESH_TOKEN_EXPIRY_DAYS);

    await this.authRepo.createRefreshToken({
      userId: user.id,
      familyId,
      tokenHash,
      generation: 1,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        tenantId,
      },
      accessToken,
      refreshToken: rawRefreshToken,
    };
  }
}
