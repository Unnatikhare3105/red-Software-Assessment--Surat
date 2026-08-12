import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/env.config';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.middleware';
import authRoutes from './routes/auth.routes';
import {requestLogger} from './middlewares/requestLogger.middleware';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import dashboardRoutes from './routes/dashboard.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

// import apiRouter from './routes'; // wired in Phase B2 once auth routes exist

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize()); // strips $/. keys to prevent NoSQL injection
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', env: config.env });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  // app.use('/api/v1', apiRouter); // uncomment once routes/index.ts exists

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}


