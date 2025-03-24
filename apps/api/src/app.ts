import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import mcpRoutes from './routes/mcp';
import walletRoutes from './routes/wallet';
import revenueDistributionRoutes from './routes/revenueDistribution';

// Import error handlers
import { AppError, globalErrorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

// Create Express app
const app = express();

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development, enable in production
}));

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
  max: 100, // Max 100 requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logger for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  logger.info('Morgan logger enabled in development mode');
}

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mcps', mcpRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/revenue', revenueDistributionRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app; 