import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  COOKIE_SECRET: z.string().default('development_cookie_secret_key_minimum_32_chars_long'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/rental_db?schema=public'),
  UPLOAD_DIR: z.string().default('./uploads/proofs'),
  MAX_FILE_SIZE_BYTES: z.string().transform(Number).default('5242880'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;

