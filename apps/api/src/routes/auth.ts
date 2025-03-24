import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name cannot exceed 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  authController.register
);

// Login route with validation
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Logout route
router.get('/logout', authController.logout);

// Get current user route (protected)
router.get('/me', protect, authController.getCurrentUser);

// Email verification route
router.get('/verify-email/:token', authController.verifyEmail);

// Forgot password route
router.post(
  '/forgot-password',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
  ],
  validateRequest,
  authController.forgotPassword
);

// Reset password route
router.post(
  '/reset-password/:token',
  [
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  validateRequest,
  authController.resetPassword
);

// Update password route (protected)
router.post(
  '/update-password',
  protect,
  [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long'),
  ],
  validateRequest,
  authController.updatePassword
);

export default router; 