import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './shared/infrastructure/logger/logger.js';
import { getPrismaClient } from './shared/infrastructure/database/prisma.js';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      environment: config.NODE_ENV,
      healthEndpoint: `http://localhost:${config.PORT}${config.API_PREFIX}/health`,
    },
    'Rental Property Management Backend Server Started'
  );
});

async function gracefulShutdown(signal) {
  logger.info({ signal }, 'Graceful shutdown initiated');

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      const prisma = getPrismaClient();
      await prisma.$disconnect();
      logger.info('Database client disconnected');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during database disconnection');
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds timeout
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

