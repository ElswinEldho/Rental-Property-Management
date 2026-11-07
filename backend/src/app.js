import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './core/config/index.js';
import { correlationIdMiddleware } from './core/middleware/correlationId.js';
import { requestLoggerMiddleware } from './core/middleware/requestLogger.js';
import { errorHandlerMiddleware } from './core/middleware/errorHandler.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { authRouter } from './modules/authentication/index.js';
import { propertyRouter } from './modules/properties/index.js';
import { rentalUnitRouter } from './modules/rental-units/index.js';
import { errorResponse } from './core/http/response.js';

export function createApp() {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'idempotency-key'],
    })
  );

  // Prevent shared/browser caching of sensitive authenticated API responses
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // Body Parsing Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(config.COOKIE_SECRET));

  // Tracing & Logging Middlewares
  app.use(correlationIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Root Health Endpoint
  app.use('/', healthRoutes);

  // Versioned API Routes
  app.use(config.API_PREFIX, healthRoutes);
  app.use(`${config.API_PREFIX}/auth`, authRouter);
  app.use(`${config.API_PREFIX}/properties`, propertyRouter);
  app.use(`${config.API_PREFIX}/units`, rentalUnitRouter);

  // 404 Handler
  app.use((req, res) => {
    return errorResponse(res, {
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
      message: `The endpoint ${req.method} ${req.originalUrl} does not exist.`,
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandlerMiddleware);

  return app;
}
