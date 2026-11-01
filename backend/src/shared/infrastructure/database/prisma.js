import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger.js';
import { config } from '../../../config/index.js';

let prismaInstance = null;

/**
 * Returns singleton PrismaClient instance
 * @returns {PrismaClient}
 */
export function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log:
        config.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'error' },
              { emit: 'stdout', level: 'warn' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });

    if (config.NODE_ENV === 'development') {
      prismaInstance.$on('query', (e) => {
        logger.debug({ query: e.query, duration: `${e.duration}ms` }, 'Database Query');
      });
    }
  }

  return prismaInstance;
}

/**
 * Validates connection to PostgreSQL
 * @returns {Promise<boolean>}
 */
export async function checkDatabaseConnection() {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.warn({ error: error.message }, 'Database connectivity check failed (PostgreSQL may be starting or offline)');
    return false;
  }
}

