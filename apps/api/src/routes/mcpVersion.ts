import express from 'express';
import { body } from 'express-validator';
import * as mcpVersionController from '../controllers/mcpVersion';
import { protect, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router({ mergeParams: true });

// Get all versions of an MCP
router.get('/', mcpVersionController.getAllVersions);

// Get a specific version of an MCP
router.get('/:version', mcpVersionController.getVersion);

// Create a new version of an MCP (protected)
router.post(
  '/',
  protect,
  [
    body('version')
      .trim()
      .notEmpty()
      .withMessage('Version is required')
      .matches(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)
      .withMessage('Version must follow semantic versioning (e.g., 1.0.0)'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('apiSchema')
      .notEmpty()
      .withMessage('API schema is required'),
    body('implementationCode')
      .notEmpty()
      .withMessage('Implementation code is required'),
  ],
  validateRequest,
  mcpVersionController.createVersion
);

// Update a version of an MCP (protected)
router.put(
  '/:version',
  protect,
  [
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty'),
    body('changeNotes')
      .optional()
      .trim(),
    body('apiSchema')
      .optional()
      .notEmpty()
      .withMessage('API schema cannot be empty'),
    body('implementationCode')
      .optional()
      .notEmpty()
      .withMessage('Implementation code cannot be empty'),
  ],
  validateRequest,
  mcpVersionController.updateVersion
);

// Delete a version of an MCP (protected)
router.delete(
  '/:version',
  protect,
  mcpVersionController.deleteVersion
);

export default router; 