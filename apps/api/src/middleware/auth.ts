import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AppError } from './errorHandler';
import logger from '../utils/logger';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Interface for decoded JWT token
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to protect routes - checks if user is authenticated
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // 1) Check if token exists in Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from Authorization header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      // Get token from cookies
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('Not authenticated. Please log in', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // 4) Set user on request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token. Please log in again', 401));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired. Please log in again', 401));
    }
    next(error);
  }
};

/**
 * Middleware to restrict access to certain roles
 * @param {...string} roles - Roles allowed to access the route
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists on request (set by protect middleware)
    if (!req.user) {
      return next(new AppError('Not authenticated. Please log in', 401));
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
}; 