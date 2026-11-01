import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Health Check & Startup API Tests', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  it('GET /health should return 200 with operational status envelope', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
    expect(res.body.data).toHaveProperty('status', 'UP');
    expect(res.body.data).toHaveProperty('uptimeSeconds');
    expect(res.body.data).toHaveProperty('environment');
    expect(res.body.data.services).toHaveProperty('api', 'HEALTHY');
    expect(res.headers['x-correlation-id']).toBeDefined();
  });

  it('GET /api/v1/health should also return 200 with matching envelope', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'UP');
  });

  it('GET /api/v1/non-existent-endpoint should return 404 with structured error envelope', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    expect(res.body).toHaveProperty('correlationId');
    expect(res.body).toHaveProperty('timestamp');
  });
});

