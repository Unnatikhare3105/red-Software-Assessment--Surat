import morgan, { StreamOptions } from 'morgan';
import { logger } from '../utils/logger';

const stream: StreamOptions = {
  write: (message: any) => logger.http ? logger.http(message.trim()) : logger.info(message.trim()),
};

// dev: colored concise logs | prod: combined format (better for log aggregators)
export const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream }
);