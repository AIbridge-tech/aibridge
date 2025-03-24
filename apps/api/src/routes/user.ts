import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Get current user profile
router.get('/profile', userController.getUserProfile);

// Get user's MCPs
router.get('/mcps', userController.getUserMcps);

// Update user profile
router.put(
  '/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),
    body('avatarUrl')
      .optional()
      .trim()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
  ],
  validateRequest,
  userController.updateProfile
);

// Admin routes
// Get all users (admin only)
router.get('/all', restrictTo('admin'), userController.getAllUsers);

// Get user by ID (admin only)
router.get('/:id', restrictTo('admin'), userController.getUserById);

// Update user by ID (admin only)
router.put(
  '/:id',
  restrictTo('admin'),
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Must provide a valid email'),
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin'),
    body('isEmailVerified')
      .optional()
      .isBoolean()
      .withMessage('Must be a boolean value'),
  ],
  validateRequest,
  userController.updateUserById
);

// Delete user by ID (admin only)
router.delete('/:id', restrictTo('admin'), userController.deleteUser);

export default router; 