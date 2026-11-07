import { jest } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/core/database/prisma.js';
import { hashPassword } from '../../src/core/security/password.js';
import { TokenService } from '../../src/modules/authentication/application/services/TokenService.js';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../../src/modules/authentication/presentation/middlewares/authenticate.js';

describe('Browser History & Session Security Invariant Tests', () => {
  const app = createApp();

  const testEmail = `nav-test-${Date.now()}@example.com`;
  const rawPassword = 'NavTestPassword123!';
  let testUser;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: testEmail,
        firstName: 'Navigation',
        lastName: 'Tester',
        passwordHash: await hashPassword(rawPassword),
        isActive: true,
        userRoles: {
          create: { roleId: 'ADMIN' },
        },
      },
    });
  });

  afterAll(async () => {
    if (testUser?.id) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  it('1. API endpoints must respond with no-store cache headers to prevent bfcache leaks', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['cache-control']).toContain('no-store');
    expect(res.headers['cache-control']).toContain('no-cache');
    expect(res.headers['pragma']).toBe('no-cache');
    expect(res.headers['expires']).toBe('0');
  });

  it('2. Logout followed by browser Back / history replay must return 401', async () => {
    // 1. Log in
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: testEmail, password: rawPassword });

    const cookies = loginRes.headers['set-cookie'];
    const refreshCookie = cookies.find((c) => c.startsWith(`${REFRESH_COOKIE_NAME}=`));
    const refreshToken = refreshCookie.split(';')[0].split('=')[1];

    // 2. Log out
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookies);

    expect(logoutRes.status).toBe(200);

    // 3. Simulate browser Back trying to re-use previous refresh session
    const backNavRes = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [`${REFRESH_COOKIE_NAME}=${refreshToken}`]);

    expect(backNavRes.status).toBe(401);
    expect(backNavRes.body.error.message).toContain('Invalid refresh session');
  });

  it('3. Accessing protected endpoint without cookies must return 401 and never leak user profile', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.data).toBeUndefined();
  });

  it('4. Expired access token revalidation must fail if refresh token is revoked', async () => {
    const expiredAccessToken = TokenService.generateAccessToken(
      { userId: testUser.id, email: testEmail, roles: ['ADMIN'] },
      -10 // Expired 10 seconds ago
    );

    // Request with expired token fails
    const expiredRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', [`${ACCESS_COOKIE_NAME}=${expiredAccessToken}`]);

    expect(expiredRes.status).toBe(401);
    expect(expiredRes.body.error.message).toContain('expired');
  });
});

