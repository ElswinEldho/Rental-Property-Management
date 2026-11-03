/**
 * Centralized Structured Logger (Pino)
 * Enforces automatic redaction of sensitive credentials, tokens, and PII.
 */

import pino from 'pino';
import { config } from '../config/index.js';

const redactPaths = [
  'password',
  'passwordHash',
  'req.headers.cookie',
  'req.headers.authorization',
  'token',
  'refreshToken',
  'tokenHash',
  'secret',
  'creditCard',
  'nationalIdNumber',
];

export const logger = pino({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: {
    paths: redactPaths,
    censor: '[REDACTED]',
  },
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    env: config.NODE_ENV,
  },
});

export default logger;

