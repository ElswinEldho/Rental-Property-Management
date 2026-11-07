/**
 * Authentication Repository Interface (Port)
 */
export class IAuthRepository {
  async findUserByIdentifier(identifier) {
    throw new Error('Method not implemented');
  }

  async findUserById(userId) {
    throw new Error('Method not implemented');
  }

  async createRefreshToken(data, tx) {
    throw new Error('Method not implemented');
  }

  async findRefreshTokenByHash(tokenHash, tx) {
    throw new Error('Method not implemented');
  }

  async rotateRefreshToken(oldTokenHash, newTokenData, tx) {
    throw new Error('Method not implemented');
  }

  async revokeTokenFamily(familyId, tx) {
    throw new Error('Method not implemented');
  }

  async revokeRefreshTokenByHash(tokenHash, tx) {
    throw new Error('Method not implemented');
  }

  async revokeAllUserSessions(userId, tx) {
    throw new Error('Method not implemented');
  }

  async updateUserPassword(userId, passwordHash, tx) {
    throw new Error('Method not implemented');
  }
}

