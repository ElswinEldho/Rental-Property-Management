import request from 'supertest';
import { createApp } from '../../src/app.js';
import { prisma } from '../../src/core/database/index.js';
import { TokenService } from '../../src/modules/authentication/application/services/TokenService.js';

describe('Rental Unit Management Module Integration Tests', () => {
  let app;
  let adminToken;
  let tenantToken;
  let propertyAId;
  let propertyBId;
  let testUnitId;

  beforeAll(async () => {
    app = createApp();

    adminToken = TokenService.generateAccessToken({
      userId: '11111111-1111-1111-1111-111111111111',
      email: 'admin@test.com',
      roles: ['ADMIN'],
      tenantId: null,
    });

    tenantToken = TokenService.generateAccessToken({
      userId: '22222222-2222-2222-2222-222222222222',
      email: 'tenant@test.com',
      roles: ['TENANT'],
      tenantId: '33333333-3333-3333-3333-333333333333',
    });

    // Create test properties A & B
    const propA = await prisma.property.create({
      data: {
        name: 'Unit Test Property A',
        addressLine1: 'Road 1',
        city: 'Kochi',
        stateProvince: 'Kerala',
        postalCode: '682001',
      },
    });
    propertyAId = propA.id;

    const propB = await prisma.property.create({
      data: {
        name: 'Unit Test Property B',
        addressLine1: 'Road 2',
        city: 'Kochi',
        stateProvince: 'Kerala',
        postalCode: '682002',
      },
    });
    propertyBId = propB.id;
  });

  afterAll(async () => {
    // Cleanup test data
    if (testUnitId) {
      await prisma.rentalUnit.deleteMany({ where: { id: testUnitId } }).catch(() => {});
    }
    if (propertyAId) {
      await prisma.rentalUnit.deleteMany({ where: { propertyId: propertyAId } }).catch(() => {});
      await prisma.property.delete({ where: { id: propertyAId } }).catch(() => {});
    }
    if (propertyBId) {
      await prisma.rentalUnit.deleteMany({ where: { propertyId: propertyBId } }).catch(() => {});
      await prisma.property.delete({ where: { id: propertyBId } }).catch(() => {});
    }
  });

  describe('Security & RBAC Enforcement', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/units');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should reject tenant request with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/units')
        .set('Authorization', `Bearer ${tenantToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('AUTHORIZATION_ERROR');
    });
  });

  describe('POST /api/v1/units (Unit Creation)', () => {
    it('should reject unit creation if property does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          propertyId: '00000000-0000-0000-0000-000000000000',
          unitNumber: '101',
          unitType: '1BHK',
          baseRentAmount: 10000,
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PROPERTY_NOT_FOUND');
    });

    it('should reject negative monthly rent amount', async () => {
      const res = await request(app)
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          propertyId: propertyAId,
          unitNumber: '101',
          unitType: '1BHK',
          baseRentAmount: -500,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should successfully create a new rental unit', async () => {
      const res = await request(app)
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          propertyId: propertyAId,
          unitNumber: '101',
          floor: 1,
          unitType: '1BHK',
          baseRentAmount: 12000,
          occupancyStatus: 'VACANT',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.unitNumber).toBe('101');
      expect(res.body.data.occupancyStatus).toBe('VACANT');
      testUnitId = res.body.data.id;
    });

    it('should reject duplicate unit number within the same property', async () => {
      const res = await request(app)
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          propertyId: propertyAId,
          unitNumber: '101',
          floor: 1,
          unitType: '1BHK',
          baseRentAmount: 12000,
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('DUPLICATE_UNIT_NUMBER');
    });

    it('should allow the same unit number under a different property', async () => {
      const res = await request(app)
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          propertyId: propertyBId,
          unitNumber: '101', // same unit number, different property
          floor: 1,
          unitType: 'RK',
          baseRentAmount: 8000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.propertyId).toBe(propertyBId);
      expect(res.body.data.unitNumber).toBe('101');
    });
  });

  describe('GET /api/v1/units (Listing & Filtering)', () => {
    it('should list units with pagination metadata', async () => {
      const res = await request(app)
        .get('/api/v1/units?limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
    });

    it('should filter units by propertyId', async () => {
      const res = await request(app)
        .get(`/api/v1/units?propertyId=${propertyAId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((u) => u.propertyId === propertyAId)).toBe(true);
    });

    it('should filter units by unitType and status', async () => {
      const res = await request(app)
        .get('/api/v1/units?unitType=1BHK&occupancyStatus=VACANT')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.every((u) => u.unitType.toUpperCase() === '1BHK')).toBe(true);
    });
  });

  describe('GET /api/v1/units/:id', () => {
    it('should retrieve unit details including property information', async () => {
      const res = await request(app)
        .get(`/api/v1/units/${testUnitId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(testUnitId);
      expect(res.body.data.property).toBeDefined();
      expect(res.body.data.property.name).toBe('Unit Test Property A');
    });

    it('should return 404 for non-existent unit', async () => {
      const res = await request(app)
        .get('/api/v1/units/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('RENTAL_UNIT_NOT_FOUND');
    });
  });

  describe('PUT /api/v1/units/:id and PATCH /status', () => {
    it('should update unit basic details and rent', async () => {
      const res = await request(app)
        .put(`/api/v1/units/${testUnitId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          unitNumber: '101-Renovated',
          baseRentAmount: 13500,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.unitNumber).toBe('101-Renovated');
      expect(Number(res.body.data.baseRentAmount)).toBe(13500);
    });

    it('should update status via PATCH /status', async () => {
      const res = await request(app)
        .patch(`/api/v1/units/${testUnitId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          occupancyStatus: 'MAINTENANCE',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.occupancyStatus).toBe('MAINTENANCE');
    });
  });

  describe('GET /api/v1/units/stats', () => {
    it('should return unit counts and occupancy metrics', async () => {
      const res = await request(app)
        .get('/api/v1/units/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('occupied');
      expect(res.body.data).toHaveProperty('vacant');
      expect(res.body.data).toHaveProperty('maintenance');
    });
  });

  describe('DELETE /api/v1/units/:id', () => {
    it('should delete a unit that has no tenancies or meters', async () => {
      const res = await request(app)
        .delete(`/api/v1/units/${testUnitId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await request(app)
        .get(`/api/v1/units/${testUnitId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(check.status).toBe(404);

      testUnitId = null;
    });
  });
});

