import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  triggerRevenueDistribution,
  updateContributorShares,
  triggerAutomaticPayouts,
  getMcpDistributionHistory
} from '../controllers/revenueDistribution';

const router = express.Router();

// Protect all routes
router.use(protect);

// Trigger revenue distribution for an MCP
router.post(
  '/mcp/:mcpId/distribute',
  triggerRevenueDistribution
);

// Update contributor shares
router.put(
  '/mcp/:mcpId/contributors',
  updateContributorShares
);

// Get MCP distribution history
router.get(
  '/mcp/:mcpId/distributions',
  getMcpDistributionHistory
);

// Trigger automatic payouts - Admin only
router.post(
  '/auto-payouts',
  restrictTo('admin'),
  triggerAutomaticPayouts
);

export default router; 