import express from 'express';
import { body, query } from 'express-validator';
import * as mcpController from '../controllers/mcp';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import mcpVersionRoutes from './mcpVersion';

const router = express.Router();

// Use mcpVersion routes for /mcps/:mcpId/versions
router.use('/:mcpId/versions', mcpVersionRoutes);

// Get all MCPs (with optional filtering)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().isString(),
    query('category').optional().isString(),
    query('sort').optional().isString(),
  ],
  validateRequest,
  mcpController.getAllMcps
);

// Get MCP by ID
router.get('/:id', mcpController.getMcpById);

// Search MCPs
router.get(
  '/search',
  [query('q').isString().notEmpty().withMessage('Search query is required')],
  validateRequest,
  mcpController.searchMcps
);

// Create new MCP (protected, requires authentication)
router.post(
  '/',
  protect,
  restrictTo('user', 'admin'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('version')
      .trim()
      .notEmpty()
      .withMessage('Version is required')
      .matches(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)
      .withMessage('Version must follow semantic versioning (e.g., 1.0.0)'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('tags').optional().isArray(),
    body('apiSchema').notEmpty().withMessage('API schema is required'),
    body('implementationCode')
      .notEmpty()
      .withMessage('Implementation code is required'),
  ],
  validateRequest,
  mcpController.createMcp
);

// Update MCP (protected)
router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('category')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Category cannot be empty'),
    body('tags').optional().isArray(),
    body('isPublic').optional().isBoolean(),
  ],
  validateRequest,
  mcpController.updateMcp
);

// Delete MCP (protected)
router.delete('/:id', protect, mcpController.deleteMcp);

// Rate MCP
router.post(
  '/:id/rate',
  protect,
  [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString(),
  ],
  validateRequest,
  mcpController.rateMcp
);

// Download MCP
router.post('/:id/download', mcpController.downloadMcp);

export default router; 