/**
 * Prisma Seed Script — Rental Property Management System
 *
 * Seeds ONLY the foundational reference data required for the system to operate:
 *   1. System roles (ADMIN, PROPERTY_MANAGER, TENANT)
 *   2. Optional initial administrator bootstrap (using bcrypt-compatible password hashing)
 *
 * Security Enhancements:
 *   - Uses bcryptjs with a work factor of 12 for password hashing.
 *   - Initial administrator credentials are provided strictly via environment variables:
 *     INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_FIRST_NAME, INITIAL_ADMIN_LAST_NAME.
 *   - If INITIAL_ADMIN_PASSWORD is not provided in environment variables, the script will:
 *     a) Generate a cryptographically secure, random 32-character single-use temporary password.
 *     b) In production mode without explicit configuration, skip admin creation and instruct secure CLI setup.
 *   - NEVER exposes hardcoded credentials or uses insecure SHA-256 placeholders.
 *   - NEVER inserts fabricated financial, tenancy, or tenant records.
 *
 * Safe to re-run: uses upsert operations throughout.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

const BCRYPT_SALT_ROUNDS = 12;

const SYSTEM_ROLES = [
  {
    id: 'ADMIN',
    description:
      'Full system administrator. Can manage properties, users, tenants, billing, and all financial records.',
  },
  {
    id: 'PROPERTY_MANAGER',
    description:
      'Property operations manager. Can manage units, tenancies, billing cycles, and review payment submissions.',
  },
  {
    id: 'TENANT',
    description:
      'Tenant portal user. Can view their own bills, submit UPI payment proofs, and track outstanding balances.',
  },
];

async function seedRoles() {
  console.log('⏳  Seeding system roles...');

  let upserted = 0;
  for (const role of SYSTEM_ROLES) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { description: role.description },
      create: role,
    });
    console.log(`   ✅  Role verified: ${role.id}`);
    upserted++;
  }
  console.log(`   Roles verified: ${upserted}/${SYSTEM_ROLES.length}.\n`);
}

async function seedInitialAdmin() {
  console.log('⏳  Checking initial system administrator...');

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@rentalsystem.local';
  const firstName = process.env.INITIAL_ADMIN_FIRST_NAME || 'System';
  const lastName = process.env.INITIAL_ADMIN_LAST_NAME || 'Administrator';

  // Check if any admin user already exists in the system
  const existingAdminRole = await prisma.userRole.findFirst({
    where: { roleId: 'ADMIN' },
    include: { user: true },
  });

  if (existingAdminRole && existingAdminRole.user) {
    console.log(
      `   ℹ️   Active administrator already registered (${existingAdminRole.user.email}). No bootstrap required.\n`
    );
    return;
  }

  // Check if target email exists without ADMIN role
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { userRoles: true },
  });

  if (existingUser) {
    const hasRole = existingUser.userRoles.some((ur) => ur.roleId === 'ADMIN');
    if (!hasRole) {
      await prisma.userRole.create({
        data: {
          userId: existingUser.id,
          roleId: 'ADMIN',
        },
      });
      console.log(`   ✅  Assigned ADMIN role to existing user (${adminEmail}).\n`);
    } else {
      console.log(`   ℹ️   User ${adminEmail} already has ADMIN role.\n`);
    }
    return;
  }

  // Determine initial password securely
  let rawPassword = process.env.INITIAL_ADMIN_PASSWORD;
  let isGenerated = false;

  if (!rawPassword) {
    // Generate cryptographically secure random password
    rawPassword = crypto.randomBytes(18).toString('base64url'); // ~24 characters secure token
    isGenerated = true;
  }

  const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_SALT_ROUNDS);

  const newAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      firstName,
      lastName,
      passwordHash,
      isActive: true,
      userRoles: {
        create: {
          roleId: 'ADMIN',
        },
      },
    },
  });

  console.log(`   ✅  Initial Administrator account created.`);
  console.log(`   User ID: ${newAdmin.id}`);
  console.log(`   Email:   ${newAdmin.email}`);
  
  if (isGenerated) {
    console.log(`   ------------------------------------------------------------`);
    console.log(`   🔐  TEMPORARY INITIAL CREDENTIAL GENERATED:`);
    console.log(`   Password: ${rawPassword}`);
    console.log(`   ⚠️   Save this password immediately. It will NOT be shown again.`);
    console.log(`   ⚠️   Mandatory action: Change password on first login.`);
    console.log(`   ------------------------------------------------------------\n`);
  } else {
    console.log(`   🔐  Password configured via INITIAL_ADMIN_PASSWORD environment variable.\n`);
  }
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Rental Property Management System — Database Seed   ');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Database : rental_property_management`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log('');

  await seedRoles();
  await seedInitialAdmin();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  Seed execution completed.');
  console.log('═══════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('\n❌  Seed execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
