import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authenticate } from '../../src/modules/authentication/presentation/middlewares/authenticate.js';
import { requireAuth, requireRoles } from '../../src/core/middleware/authGuard.js';
import { errorHandlerMiddleware } from '../../src/core/middleware/errorHandler.js';
import { TokenService } from '../../src/modules/authentication/application/services/TokenService.js';
import { ACCESS_COOKIE_NAME } from '../../src/modules/authentication/presentation/middlewares/authenticate.js';

describe('Role-Based Authorization & Tenant Isolation Tests', () => {
  const app = express();
  app.use(cookieParser('test-cookie-secret-key-minimum-32-chars-long'));

  // Protected Admin Endpoint
  app.get('/admin/protected', authenticate, requireRoles('ADMIN'), (req, res) => {
    res.json({ success: true, message: 'Welcome Admin', user: req.user });
  });

  // Protected Tenant Endpoint
  app.get('/tenant/bills/:tenantId', authenticate, requireRoles('TENANT'), (req, res) => {
    // IDOR Protection: Tenant can only access their own tenantId
    if (req.user.tenantId !== req.params.tenantId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied: cannot access another tenant data.' },
      });
    }
    res.json({ success: true, message: 'Tenant bill list', tenantId: req.params.tenantId });
  });

  app.use(errorHandlerMiddleware);

  const adminToken = TokenService.generateAccessToken({
    userId: 'admin-uuid-1',
    email: 'admin@system.local',
    roles: ['ADMIN'],
  });

  const tenantToken1 = TokenService.generateAccessToken({
    userId: 'tenant-user-uuid-1',
    email: 'tenant1@rental.local',
    roles: ['TENANT'],
    tenantId: 'tenant-profile-uuid-1',
  });

  const tenantToken2 = TokenService.generateAccessToken({
    userId: 'tenant-user-uuid-2',
    email: 'tenant2@rental.local',
    roles: ['TENANT'],
    tenantId: 'tenant-profile-uuid-2',
  });

  it('should return 401 Unauthorized when no credentials are provided', async () => {
    const res = await request(app).get('/admin/protected');
    expect(res.status).toBe(401);
  });

  it('should allow ADMIN to access Admin-only endpoints', async () => {
    const res = await request(app)
      .get('/admin/protected')
      .set('Cookie', [`${ACCESS_COOKIE_NAME}=${adminToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('admin@system.local');
  });

  it('should reject TENANT trying to access Admin endpoints with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/admin/protected')
      .set('Cookie', [`${ACCESS_COOKIE_NAME}=${tenantToken1}`]);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('AUTHORIZATION_ERROR');
  });

  it('should allow TENANT to access their own resources', async () => {
    const res = await request(app)
      .get('/tenant/bills/tenant-profile-uuid-1')
      .set('Cookie', [`${ACCESS_COOKIE_NAME}=${tenantToken1}`]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should deny TENANT accessing another tenant resource (IDOR protection) with 403', async () => {
    // Tenant 1 tries to access Tenant 2's bills
    const res = await request(app)
      .get('/tenant/bills/tenant-profile-uuid-2')
      .set('Cookie', [`${ACCESS_COOKIE_NAME}=${tenantToken1}`]);

    expect(res.status).toBe(403);
    expect(res.body.error.message).toContain('cannot access another tenant data');
  });
});

