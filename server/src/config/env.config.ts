import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads process.env exactly once, here. Nowhere else in the codebase should
 * reference `process.env` directly — import `config` instead.
 * Object.freeze makes this immutable at runtime (deep freeze not needed since
 * every value here is a primitive).
 */
function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = Object.freeze({
  env: required('NODE_ENV', 'development'),
  port: Number(required('PORT')),

  mongo: Object.freeze({
    uri: required('MONGO_URI'),
  }),

  redis: Object.freeze({
    host: required('REDIS_HOST', '127.0.0.1'),
    port: Number(required('REDIS_PORT', '6379')),
    password: process.env.REDIS_PASSWORD ?? undefined,
  }),

  jwt: Object.freeze({
    accessSecret: required('JWT_ACCESS_SECRET'),
    refreshSecret: required('JWT_REFRESH_SECRET'),
    accessExpiresIn: required('JWT_ACCESS_EXPIRES_IN'),
    refreshExpiresIn: required('JWT_REFRESH_EXPIRES_IN'),
  }),

  cors: Object.freeze({
    origin: required('CORS_ORIGIN', 'http://localhost:3000'),
  }),

  aws: Object.freeze({
    region: process.env.AWS_REGION ?? '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    bucketName: process.env.AWS_BUCKET_NAME ?? '',
  }),

  logLevel: required('LOG_LEVEL', 'info'),
});

export type AppConfig = typeof config;

