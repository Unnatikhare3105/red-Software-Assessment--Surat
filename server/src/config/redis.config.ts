import Redis from 'ioredis';
import { config } from './env.config';
import { logger } from '../utils/logger';

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: 3,
});

redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (err: Error) => logger.error('Redis error', err));