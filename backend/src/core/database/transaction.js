import { getPrismaClient } from './prisma.js';
import { mapPrismaError } from '../errors/prismaErrorMapper.js';

/**
 * Executes a callback within an interactive Prisma transaction.
 * Automatically wraps errors with domain-level AppErrors.
 *
 * @template T
 * @param {(tx: import('@prisma/client').Prisma.TransactionClient) => Promise<T>} callback
 * @param {object} [options]
 * @param {number} [options.maxWait=5000] - Max time to wait for a connection (ms)
 * @param {number} [options.timeout=10000] - Max transaction duration (ms)
 * @param {string} [options.isolationLevel] - Optional isolation level ('ReadCommitted', 'Serializable', etc.)
 * @returns {Promise<T>}
 */
export async function runTransaction(callback, options = {}) {
  const prisma = getPrismaClient();

  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    }, {
      maxWait: options.maxWait || 5000,
      timeout: options.timeout || 10000,
      isolationLevel: options.isolationLevel,
    });
  } catch (error) {
    throw mapPrismaError(error);
  }
}

