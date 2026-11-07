import { prisma as defaultPrisma } from '../../../../core/database/prisma.js';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';

/**
 * Prisma implementation of the Authentication Repository.
 */
export class PrismaAuthRepository extends IAuthRepository {
  constructor(prismaClient = defaultPrisma) {
    super();
    this.prisma = prismaClient;
  }

  _getClient(tx) {
    return tx || this.prisma;
  }

  /**
   * Finds an active user by email or phone.
   *
   * @param {string} identifier - Email or phone
   * @returns {Promise<any>}
   */
  async findUserByIdentifier(identifier) {
    const normalized = identifier.toLowerCase().trim();

    return await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: normalized, mode: 'insensitive' } },
          { phone: normalized },
        ],
      },
      include: {
        userRoles: {
          select: { roleId: true },
        },
        tenant: {
          select: { id: true, invitationStatus: true },
        },
      },
    });
  }

  /**
   * Finds a user by ID.
   *
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async findUserById(userId) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          select: { roleId: true },
        },
        tenant: {
          select: { id: true, invitationStatus: true },
        },
      },
    });
  }

  /**
   * Creates a new refresh token record.
   */
  async createRefreshToken(data, tx) {
    const client = this._getClient(tx);
    return await client.refreshToken.create({
      data: {
        userId: data.userId,
        familyId: data.familyId,
        tokenHash: data.tokenHash,
        generation: data.generation || 1,
        isRevoked: false,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  /**
   * Finds a refresh token by its SHA-256 hash.
   */
  async findRefreshTokenByHash(tokenHash, tx) {
    const client = this._getClient(tx);
    return await client.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            userRoles: { select: { roleId: true } },
            tenant: { select: { id: true } },
          },
        },
      },
    });
  }

  /**
   * Atomically rotates a refresh token: revokes old and inserts replacement.
   */
  async rotateRefreshToken(oldTokenHash, newTokenData, tx) {
    const client = this._getClient(tx);

    // 1. Mark existing token as revoked and record successor token hash
    await client.refreshToken.update({
      where: { tokenHash: oldTokenHash },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
        replacedByTokenHash: newTokenData.tokenHash,
      },
    });

    // 2. Insert new child token in the same token family
    return await client.refreshToken.create({
      data: {
        userId: newTokenData.userId,
        familyId: newTokenData.familyId,
        tokenHash: newTokenData.tokenHash,
        generation: newTokenData.generation,
        isRevoked: false,
        expiresAt: newTokenData.expiresAt,
        ipAddress: newTokenData.ipAddress || null,
        userAgent: newTokenData.userAgent || null,
      },
    });
  }

  /**
   * Revokes an entire token family upon token reuse / replay detection.
   */
  async revokeTokenFamily(familyId, tx) {
    const client = this._getClient(tx);
    return await client.refreshToken.updateMany({
      where: { familyId, isRevoked: false },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revokes a single refresh token by its hash (standard single-session logout).
   */
  async revokeRefreshTokenByHash(tokenHash, tx) {
    const client = this._getClient(tx);
    return await client.refreshToken.updateMany({
      where: { tokenHash, isRevoked: false },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revokes all active refresh tokens for a user (e.g. password change).
   */
  async revokeAllUserSessions(userId, tx) {
    const client = this._getClient(tx);
    return await client.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Updates user password hash.
   */
  async updateUserPassword(userId, passwordHash, tx) {
    const client = this._getClient(tx);
    return await client.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

