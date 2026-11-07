import { AuthenticationError, NotFoundError } from '../../../../core/errors/AppError.js';

export class GetCurrentUserUseCase {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  /**
   * Retrieves the current authenticated user's safe identity details.
   *
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async execute(userId) {
    const user = await this.authRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User', userId);
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is inactive.');
    }

    const roles = user.userRoles.map((ur) => ur.roleId);

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      tenantId: user.tenant?.id || null,
      tenantStatus: user.tenant?.invitationStatus || null,
      createdAt: user.createdAt,
    };
  }
}

