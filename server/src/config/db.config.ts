import mongoose from 'mongoose';
import { config } from './env.config';
import { logger } from '../utils/logger';

export function connectDB(): Promise<void> {
  return mongoose
    .connect(config.mongo.uri)
    .then(() => {
      logger.info('MongoDB connected');

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });
    })
    .catch((err) => {
      logger.error('MongoDB connection failed', err);
      process.exit(1);
    });
}