import { verifyPassword, hashPassword } from '../../../../core/security/password.js';
import { AuthenticationError, NotFoundError, ValidationError } from '../../../../core/errors/AppError.js';
import { runTransaction } from '../../../../core/database/transaction.js';

export class ChangePasswordUseCase {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  /**
   * Securely changes the user's password and revokes all active refresh sessions.
   *
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.currentPassword
   * @param {string} params.newPassword
   * @returns {Promise<void>}
   */
  async execute({ userId, currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw new ValidationError('Current password and new password are required.');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters long.');
    }

    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Incorrect current password.');
    }

    const newHash = await hashPassword(newPassword);

    await runTransaction(async (tx) => {
      // 1. Update password
      await this.authRepo.updateUserPassword(userId, newHash, tx);

      // 2. Revoke all existing sessions to enforce re-authentication
      await this.authRepo.revokeAllUserSessions(userId, tx);
    });
  }
}

