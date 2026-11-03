import { Router } from 'express';
import { checkDatabaseConnection } from '../core/database/prisma.js';
import { successResponse } from '../core/http/response.js';
import { config } from '../core/config/index.js';

const router = Router();

router.get('/health', async (req, res) => {
  const isDbConnected = await checkDatabaseConnection();

  return successResponse(res, {
    statusCode: 200,
    message: 'Rental Property Management API is operational',
    data: {
      status: 'UP',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      services: {
        api: 'HEALTHY',
        database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
      },
    },
  });
});

export const healthRoutes = router;
