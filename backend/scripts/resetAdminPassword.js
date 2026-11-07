import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/core/security/password.js';

dotenv.config();

const TARGET_ADMIN_EMAIL = 'admin@rentalsystem.local';

async function resetAdminPassword() {
  const newPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
    console.error('❌ Error: INITIAL_ADMIN_PASSWORD is missing or shorter than 8 characters in backend/.env.');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    console.log(`🔍 Locating administrator account: ${TARGET_ADMIN_EMAIL}...`);

    const user = await prisma.user.findUnique({
      where: { email: TARGET_ADMIN_EMAIL },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      console.error(`❌ Error: User with email '${TARGET_ADMIN_EMAIL}' was not found in the database.`);
      process.exit(1);
    }

    const hasAdminRole = user.userRoles.some((ur) => ur.roleId === 'ADMIN');
    if (!hasAdminRole) {
      console.error(`❌ Error: User '${TARGET_ADMIN_EMAIL}' does not have the ADMIN role.`);
      process.exit(1);
    }

    console.log('🔒 Generating bcrypt hash with 12 salt rounds...');
    const passwordHash = await hashPassword(newPassword.trim());

    console.log('🔄 Executing password update and session revocation transaction...');
    await prisma.$transaction(async (tx) => {
      // 1. Update only the passwordHash of the existing admin
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // 2. Revoke all existing refresh token sessions for this admin
      const revokedCount = await tx.refreshToken.updateMany({
        where: { userId: user.id, isRevoked: false },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
        },
      });

      console.log(`   ✓ Revoked ${revokedCount.count} active refresh token session(s).`);
    });

    console.log('✅ Admin password has been successfully reset.');
    console.log(`   Account: ${TARGET_ADMIN_EMAIL}`);
    console.log('   All prior sessions have been invalidated.');
  } catch (error) {
    console.error('❌ Error executing admin password reset:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();

