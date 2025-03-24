import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Server configuration
export const SERVER_PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const API_PREFIX = process.env.API_PREFIX || '/api';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// MongoDB configuration
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aibridge';

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt-super-secret-key-for-development-only';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Logging configuration
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const LOG_FILE = process.env.LOG_FILE || '../logs/api.log';

// Validation for critical environment variables
if (NODE_ENV === 'production') {
  if (JWT_SECRET === 'jwt-super-secret-key-for-development-only') {
    console.error('WARNING: Using default JWT_SECRET in production. Set a secure secret key.');
  }
  
  if (MONGODB_URI === 'mongodb://localhost:27017/aibridge') {
    console.error('WARNING: Using default MongoDB URI in production. Set a secure MongoDB URI.');
  }
} 