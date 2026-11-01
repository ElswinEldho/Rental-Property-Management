import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { correlationIdMiddleware } from './shared/presentation/middlewares/correlationId.js';
import { requestLoggerMiddleware } from './shared/presentation/middlewares/requestLogger.js';
import { errorHandlerMiddleware } from './shared/presentation/middlewares/errorHandler.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { errorResponse } from './shared/presentation/utils/response.js';

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

