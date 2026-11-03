/**
 * Centralized Application Environment Configuration
 * Validates and exposes a frozen configuration object.
 * Business modules MUST import this module and NEVER access process.env directly.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  COOKIE_SECRET: z.string().min(32).default('development_cookie_secret_key_minimum_32_chars_long'),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://postgres:112004@localhost:5432/rental_property_management?schema=public'),
  UPLOAD_DIR: z.string().default('./uploads/proofs'),
  MAX_FILE_SIZE_BYTES: z.string().transform(Number).default('5242880'),
  INITIAL_ADMIN_EMAIL: z.string().email().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.format());
  process.exit(1);
}

export const config = Object.freeze(parsed.data);
export default config;

