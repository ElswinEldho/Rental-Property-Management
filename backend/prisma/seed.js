/**
 * Prisma Seed Script — Rental Property Management System
 *
 * Seeds ONLY the foundational reference data required for the system to operate:
 *   1. System roles  (ADMIN, PROPERTY_MANAGER, TENANT)
 *   2. Root admin user account (development only — password must be changed on first login)
 *
 * ⚠️  This script does NOT insert any:
 *   - Properties, rental units, tenancy agreements
 *   - Tenants, bills, payments, or any financial records
 *   - Any fabricated or placeholder production data
 *
 * Safe to re-run: uses upsert operations throughout.
 */

import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derives a bcrypt-compatible SHA-256 hash of a password.
 * In production the application layer uses bcrypt. This seed uses a simple
 * placeholder hash to avoid a bcrypt dependency at seed time.
 * The ADMIN MUST change this password immediately after first login.
 *
 * @param {string} plaintext
 * @returns {string} hex string (64 chars)
 */
function devPasswordHash(plaintext) {
  return createHash('sha256').update(plaintext).digest('hex');
}

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------

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

/**
 * Development root admin account.
 * Password: admin@123 (MUST be changed immediately after first login).
 * email: admin@rentalsystem.local
 */
const ROOT_ADMIN = {
  email: 'admin@rentalsystem.local',
  firstName: 'System',
  lastName: 'Administrator',
  phone: null,
  // Dev-only SHA-256 placeholder — replace with bcrypt hash in application auth layer
  passwordHash: devPasswordHash('admin@123'),
  isActive: true,
};

// ---------------------------------------------------------------------------
// Seed execution
// ---------------------------------------------------------------------------

async function seedRoles() {
  console.log('⏳  Seeding system roles...');

  let created = 0;
  let skipped = 0;

  for (const role of SYSTEM_ROLES) {
    const result = await prisma.role.upsert({
      where: { id: role.id },
      update: { description: role.description }, // Keep description up to date
      create: role,
    });

    if (result.description === role.description) {
      console.log(`   ✅  Role: ${role.id}`);
    } else {
      console.log(`   ↩️   Role already exists (unchanged): ${role.id}`);
      skipped++;
    }
  }

  console.log(`   Roles done — ${SYSTEM_ROLES.length - skipped} upserted.\n`);
}

async function seedRootAdmin() {
  console.log('⏳  Seeding root admin user...');

  const existing = await prisma.user.findUnique({
    where: { email: ROOT_ADMIN.email },
    include: { userRoles: true },
  });

  if (existing) {
    console.log(
      `   ↩️   Admin user already exists: ${ROOT_ADMIN.email} (id: ${existing.id})`
    );

    // Ensure ADMIN role is assigned even if user exists
    const hasAdminRole = existing.userRoles.some((ur) => ur.roleId === 'ADMIN');
    if (!hasAdminRole) {
      await prisma.userRole.create({
        data: { userId: existing.id, roleId: 'ADMIN' },
      });
      console.log(`   ✅  ADMIN role assigned to existing user.`);
    } else {
      console.log(`   ↩️   ADMIN role already assigned.`);
    }

    console.log();
    return existing;
  }

  // Create new admin user
  const adminUser = await prisma.user.create({
    data: {
      email: ROOT_ADMIN.email,
      firstName: ROOT_ADMIN.firstName,
      lastName: ROOT_ADMIN.lastName,
      phone: ROOT_ADMIN.phone,
      passwordHash: ROOT_ADMIN.passwordHash,
      isActive: ROOT_ADMIN.isActive,
      userRoles: {
        create: { roleId: 'ADMIN' },
      },
    },
  });

  console.log(`   ✅  Admin user created: ${adminUser.email} (id: ${adminUser.id})`);
  console.log(`   ⚠️   Default password set to: admin@123`);
  console.log(`   ⚠️   CHANGE THIS PASSWORD BEFORE GOING TO PRODUCTION!\n`);

  return adminUser;
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Rental Property Management System — Database Seed   ');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Database: rental_property_management`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log('');
  console.log('  Seeding ONLY foundational reference data.');
  console.log('  No financial records will be inserted.');
  console.log('');

  await seedRoles();
  await seedRootAdmin();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  Seed completed successfully.');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
