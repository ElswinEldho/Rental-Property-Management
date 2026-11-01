import pino from 'pino';
import { config } from '../../../config/index.js';

export const logger = pino({
  level: config.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    config.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  redact: {
    paths: ['req.headers.cookie', 'password', 'passwordHash', 'token', 'refreshToken'],
    censor: '[REDACTED]',
  },
});

