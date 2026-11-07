import { hashToken } from '../../../../core/security/tokens.js';

export class LogoutUseCase {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  /**
   * Logs out the current session by revoking the refresh token in the database.
   *
   * @param {object} params
   * @param {string} [params.rawRefreshToken]
   * @returns {Promise<void>}
   */
  async execute({ rawRefreshToken }) {
    if (rawRefreshToken && typeof rawRefreshToken === 'string') {
      const tokenHash = hashToken(rawRefreshToken);
      await this.authRepo.revokeRefreshTokenByHash(tokenHash);
    }
  }
}

