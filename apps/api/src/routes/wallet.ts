import express from 'express';
import { body, param } from 'express-validator';
import * as walletController from '../controllers/wallet';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

// All wallet routes require authentication
router.use(protect);

// Connect wallet
router.post(
  '/connect',
  [
    body('walletAddress')
      .notEmpty()
      .withMessage('Wallet address cannot be empty')
      .isString()
      .withMessage('Wallet address must be a string'),
    body('signature')
      .notEmpty()
      .withMessage('Signature cannot be empty')
      .isString()
      .withMessage('Signature must be a string'),
    body('message')
      .notEmpty()
      .withMessage('Message cannot be empty')
      .isString()
      .withMessage('Message must be a string'),
  ],
  validateRequest,
  walletController.connectWallet
);

// Get wallet balance
router.get('/balance', walletController.getWalletBalance);

// Get transaction history
router.get('/transactions', walletController.getTransactionHistory);

// Withdraw tokens
router.post(
  '/withdraw',
  [
    body('amount')
      .notEmpty()
      .withMessage('Amount cannot be empty')
      .isFloat({ min: 0.000001 })
      .withMessage('Amount must be positive and at least 0.000001'),
    body('destinationAddress')
      .notEmpty()
      .withMessage('Destination address cannot be empty')
      .isString()
      .withMessage('Destination address must be a string'),
  ],
  validateRequest,
  walletController.withdrawTokens
);

// Get earnings overview
router.get('/earnings', walletController.getEarningsOverview);

// Get specific MCP earnings
router.get(
  '/earnings/:mcpId',
  [
    param('mcpId')
      .notEmpty()
      .withMessage('MCP ID cannot be empty')
      .isMongoId()
      .withMessage('Invalid MCP ID format'),
  ],
  validateRequest,
  walletController.getMcpEarnings
);

// Update payment settings
router.put(
  '/payment-settings',
  [
    body('preferredCurrency')
      .optional()
      .isIn(['AIB', 'ETH', 'SOL', 'USD'])
      .withMessage('Unsupported currency type'),
    body('autoWithdraw')
      .optional()
      .isBoolean()
      .withMessage('Auto withdraw must be a boolean'),
    body('withdrawThreshold')
      .optional()
      .isFloat({ min: 10 })
      .withMessage('Withdrawal threshold must be a number and at least 10'),
  ],
  validateRequest,
  walletController.updatePaymentSettings
);

export default router; 