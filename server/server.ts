import { createApp } from './src/app';
import { config } from './src/config/env.config';
import { connectDB } from './src/config/db.config';
import './src/config/redis.config'; // establishes redis connection on import
import { logger } from './src/utils/logger';
import http from 'http';

async function bootstrap(): Promise<void> {
  connectDB();

  const app = createApp();
  const createserver = http.createServer(app);

  const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} [${config.env}]`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', reason);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => process.exit(0));
  });
}

bootstrap();