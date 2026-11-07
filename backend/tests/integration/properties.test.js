import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/core/database/index.js';
import { TokenService } from '../../src/modules/authentication/application/services/TokenService.js';

describe('Properties Module Integration Tests', () => {
  let app;
  let adminToken;
  let tenantToken;
  let createdPropertyId;

  beforeAll(async () => {
    app = createApp();

    // Create a mock admin access token
    adminToken = TokenService.generateAccessToken({
      userId: '11111111-1111-1111-1111-111111111111',
      email: 'admin@test.com',
      roles: ['ADMIN'],
      tenantId: null,
    });

    // Create a mock tenant access token
    tenantToken = TokenService.generateAccessToken({
      userId: '22222222-2222-2222-2222-222222222222',
      email: 'tenant@test.com',
      roles: ['TENANT'],
      tenantId: '33333333-3333-3333-3333-333333333333',
    });
  });

  afterAll(async () => {
    // Cleanup created test property
    if (createdPropertyId) {
      await prisma.rentalUnit.deleteMany({ where: { propertyId: createdPropertyId } }).catch(() => {});
      await prisma.property.delete({ where: { id: createdPropertyId } }).catch(() => {});
    }
  });

  describe('Security & Role Guard', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/properties');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should reject tenant role with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/properties')
        .set('Authorization', `Bearer ${tenantToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AUTHORIZATION_ERROR');
    });
  });

  describe('POST /api/v1/properties', () => {
    it('should fail with 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should successfully create a new property with valid payload', async () => {
      const payload = {
        name: 'Test Residency Alpha',
        addressLine1: '123 Main Road',
        addressLine2: 'Suite 4B',
        city: 'Kochi',
        stateProvince: 'Kerala',
        postalCode: '682001',
        country: 'India',
        upiId: 'owner@okhdfcbank',
        upiPayeeName: 'Property Alpha Owner',
      };

      const res = await request(app)
        .post('/api/v1/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(payload.name);
      expect(res.body.data.city).toBe('Kochi');

      createdPropertyId = res.body.data.id;
    });
  });

  describe('GET /api/v1/properties', () => {
    it('should list properties with pagination and unit summary', async () => {
      const res = await request(app)
        .get('/api/v1/properties?limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);

      const found = res.body.data.find((p) => p.id === createdPropertyId);
      expect(found).toBeDefined();
      expect(found.unitSummary).toBeDefined();
      expect(found.unitSummary.total).toBe(0);
    });

    it('should filter properties by search query', async () => {
      const res = await request(app)
        .get('/api/v1/properties?search=Alpha')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.some((p) => p.id === createdPropertyId)).toBe(true);
    });
  });

  describe('GET /api/v1/properties/:id', () => {
    it('should return 404 for a non-existent UUID', async () => {
      const res = await request(app)
        .get('/api/v1/properties/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PROPERTY_NOT_FOUND');
    });

    it('should return 400 for an invalid UUID param', async () => {
      const res = await request(app)
        .get('/api/v1/properties/not-a-valid-uuid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should retrieve property details by ID with unit list', async () => {
      const res = await request(app)
        .get(`/api/v1/properties/${createdPropertyId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdPropertyId);
      expect(res.body.data.name).toBe('Test Residency Alpha');
      expect(Array.isArray(res.body.data.rentalUnits)).toBe(true);
    });
  });

  describe('PUT /api/v1/properties/:id', () => {
    it('should update property details', async () => {
      const res = await request(app)
        .put(`/api/v1/properties/${createdPropertyId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Residency Alpha Updated',
          city: 'Ernakulam',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Residency Alpha Updated');
      expect(res.body.data.city).toBe('Ernakulam');
    });
  });

  describe('GET /api/v1/properties/summary', () => {
    it('should return portfolio statistics', async () => {
      const res = await request(app)
        .get('/api/v1/properties/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalProperties');
      expect(res.body.data).toHaveProperty('totalUnits');
      expect(res.body.data).toHaveProperty('occupiedUnits');
      expect(res.body.data).toHaveProperty('vacantUnits');
      expect(res.body.data).toHaveProperty('occupancyRate');
    });
  });

  describe('DELETE /api/v1/properties/:id', () => {
    it('should delete a property that has zero units', async () => {
      const res = await request(app)
        .delete(`/api/v1/properties/${createdPropertyId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it's gone
      const verifyRes = await request(app)
        .get(`/api/v1/properties/${createdPropertyId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(verifyRes.status).toBe(404);

      createdPropertyId = null;
    });
  });
});
