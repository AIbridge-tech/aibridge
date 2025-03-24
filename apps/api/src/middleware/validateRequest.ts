import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

/**
 * Middleware to validate request using express-validator
 * Checks for validation errors and returns a formatted error response
 */
export const validateRequest = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
    
    const errorMessage = `Validation failed: ${errorMessages.map(e => `${e.field} - ${e.message}`).join(', ')}`;
    
    return next(new AppError(errorMessage, 400, errorMessages));
  }
  
  next();
}; 