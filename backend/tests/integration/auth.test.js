import { jest } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/core/database/prisma.js';
import { hashPassword } from '../../src/core/security/password.js';
import { generateSecureToken, hashToken, generateUUID } from '../../src/core/security/tokens.js';
import { TokenService } from '../../src/modules/authentication/application/services/TokenService.js';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../../src/modules/authentication/presentation/middlewares/authenticate.js';

describe('Authentication & Authorization Module Tests', () => {
  const app = createApp();

  const testAdminEmail = `admin-test-${Date.now()}@example.com`;
  const testTenantEmail = `tenant-test-${Date.now()}@example.com`;
  const rawPassword = 'Password123!';
  let adminUser;
  let tenantUser;

  beforeAll(async () => {
    const passwordHash = await hashPassword(rawPassword);

    // 1. Create test admin
    adminUser = await prisma.user.create({
      data: {
        email: testAdminEmail,
        firstName: 'Admin',
        lastName: 'Tester',
        passwordHash,
        isActive: true,
        userRoles: {
          create: { roleId: 'ADMIN' },
        },
      },
      include: { userRoles: true },
    });

    // 2. Create test tenant user
    tenantUser = await prisma.user.create({
      data: {
        email: testTenantEmail,
        firstName: 'Tenant',
        lastName: 'Tester',
        passwordHash,
        isActive: true,
        userRoles: {
          create: { roleId: 'TENANT' },
        },
        tenant: {
          create: {
            firstName: 'Tenant',
            lastName: 'Tester',
            email: testTenantEmail,
            phone: `+91${Date.now().toString().slice(-10)}`,
            invitationStatus: 'ACCEPTED',
          },
        },
      },
      include: { userRoles: true, tenant: true },
    });
  });

  afterAll(async () => {
    // Cleanup test users
    if (adminUser?.id) {
      await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    }
    if (tenantUser?.id) {
      await prisma.user.delete({ where: { id: tenantUser.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  describe('1. Login Feature Tests', () => {
    it('should successfully log in an Admin with valid credentials and set HttpOnly cookies', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: testAdminEmail,
          password: rawPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testAdminEmail);
      expect(res.body.data.user.roles).toContain('ADMIN');
      expect(res.body.data.user.passwordHash).toBeUndefined();

      // Verify Set-Cookie headers
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c) => c.includes(ACCESS_COOKIE_NAME) && c.includes('HttpOnly'))).toBe(true);
      expect(cookies.some((c) => c.includes(REFRESH_COOKIE_NAME) && c.includes('HttpOnly'))).toBe(true);
    });

    it('should successfully log in a Tenant with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: testTenantEmail,
          password: rawPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testTenantEmail);
      expect(res.body.data.user.roles).toContain('TENANT');
      expect(res.body.data.user.tenantId).toBe(tenantUser.tenant.id);
    });

    it('should reject login with incorrect password with generic error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: testAdminEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid credentials.');
    });

    it('should reject login with unknown identifier with generic error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: 'nonexistent-user@example.com',
          password: rawPassword,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Invalid credentials.');
    });

    it('should reject inactive/disabled accounts', async () => {
      const disabledEmail = `disabled-${Date.now()}@example.com`;
      const disabledUser = await prisma.user.create({
        data: {
          email: disabledEmail,
          firstName: 'Inactive',
          lastName: 'User',
          passwordHash: await hashPassword(rawPassword),
          isActive: false,
          userRoles: { create: { roleId: 'TENANT' } },
        },
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: disabledEmail,
          password: rawPassword,
        });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toContain('deactivated');

      await prisma.user.delete({ where: { id: disabledUser.id } });
    });

    it('should reject requests with missing fields via validation middleware', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('2. Token Lifecycle & Rotation Tests', () => {
    let currentRefreshToken;
    let currentAccessToken;

    beforeEach(async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          identifier: testAdminEmail,
          password: rawPassword,
        });

      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
      const accessCookie = cookies.find((c) => c.startsWith(`${ACCESS_COOKIE_NAME}=`));

      currentRefreshToken = refreshCookie.split(';')[0].split('=')[1];
      currentAccessToken = accessCookie.split(';')[0].split('=')[1];
    });

    it('should rotate refresh token and issue new access token on valid /refresh', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`${REFRESH_COOKIE_NAME}=${currentRefreshToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const newCookies = res.headers['set-cookie'];
      const newRefreshCookie = newCookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
      const newRefreshToken = newRefreshCookie.split(';')[0].split('=')[1];

      expect(newRefreshToken).not.toBe(currentRefreshToken);

      // Verify old token is marked as revoked in DB
      const oldTokenRecord = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(currentRefreshToken) },
      });
      expect(oldTokenRecord.isRevoked).toBe(true);
      expect(oldTokenRecord.replacedByTokenHash).toBe(hashToken(newRefreshToken));
    });

    it('should detect refresh token reuse and invalidate the entire token family', async () => {
      // 1. First rotation - valid
      const firstRotation = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`${REFRESH_COOKIE_NAME}=${currentRefreshToken}`]);

      expect(firstRotation.status).toBe(200);

      // 2. Replay attack: attempt to use the OLD (already rotated) token again
      const replayRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`${REFRESH_COOKIE_NAME}=${currentRefreshToken}`]);

      expect(replayRes.status).toBe(401);
      expect(replayRes.body.error.message).toContain('Invalid refresh session');

      // 3. Verify ALL tokens in the family have been revoked
      const oldRecord = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(currentRefreshToken) },
      });

      const familyTokens = await prisma.refreshToken.findMany({
        where: { familyId: oldRecord.familyId },
      });

      expect(familyTokens.every((t) => t.isRevoked === true)).toBe(true);
    });

    it('should reject expired access tokens', async () => {
      // Generate expired token (-10 seconds)
      const expiredToken = TokenService.generateAccessToken(
        { userId: adminUser.id, email: testAdminEmail, roles: ['ADMIN'] },
        -10
      );

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`${ACCESS_COOKIE_NAME}=${expiredToken}`]);

      expect(res.status).toBe(401);
      expect(res.body.error.message).toContain('expired');
    });

    it('should reject access tokens with invalid signatures', async () => {
      const tamperedToken = `${currentAccessToken.slice(0, -6)}tamper`;

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', [`${ACCESS_COOKIE_NAME}=${tamperedToken}`]);

      expect(res.status).toBe(401);
      expect(res.body.error.message).toContain('signature');
    });
  });

  describe('3. Session Management & Logout Tests', () => {
    it('should return current user profile on GET /auth/me for authenticated user', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: testAdminEmail, password: rawPassword });

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', cookies);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testAdminEmail);
      expect(res.body.data.user.roles).toContain('ADMIN');
    });

    it('should successfully logout and clear cookies', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: testAdminEmail, password: rawPassword });

      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
      const refreshToken = refreshCookie.split(';')[0].split('=')[1];

      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Verify token is revoked in DB
      const record = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(refreshToken) },
      });
      expect(record.isRevoked).toBe(true);

      // Subsequent refresh must fail
      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [`${REFRESH_COOKIE_NAME}=${refreshToken}`]);

      expect(refreshRes.status).toBe(401);
    });

    it('should change password and invalidate all active sessions', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: testTenantEmail, password: rawPassword });

      const cookies = loginRes.headers['set-cookie'];
      const refreshCookie = cookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
      const oldRefreshToken = refreshCookie.split(';')[0].split('=')[1];

      const newPassword = 'BrandNewPassword123!';

      const changeRes = await request(app)
        .post('/api/v1/auth/change-password')
        .set('Cookie', cookies)
        .send({
          currentPassword: rawPassword,
          newPassword,
        });

      expect(changeRes.status).toBe(200);

      // Verify old refresh session is revoked
      const oldRecord = await prisma.refreshToken.findUnique({
        where: { tokenHash: hashToken(oldRefreshToken) },
      });
      expect(oldRecord.isRevoked).toBe(true);

      // Login with old password must fail
      const failedLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: testTenantEmail, password: rawPassword });
      expect(failedLogin.status).toBe(401);

      // Login with new password must succeed
      const successfulLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ identifier: testTenantEmail, password: newPassword });
      expect(successfulLogin.status).toBe(200);
    });
  });
});

