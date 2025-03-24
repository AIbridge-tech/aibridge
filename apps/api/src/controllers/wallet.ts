import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import Transaction from '../models/transaction';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

// Connect external wallet
export const connectWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress) {
      throw new AppError('Please provide wallet address', 400);
    }
    
    // Validate wallet address format
    const isValidEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    const isValidSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress);
    
    if (!isValidEthereumAddress && !isValidSolanaAddress) {
      throw new AppError('Invalid wallet address format', 400);
    }
    
    // TODO: Validate signature in production environment
    // Simplified handling here, just check if signature and message are provided
    if (!signature || !message) {
      throw new AppError('Please provide valid signature and message', 400);
    }
    
    // Check if wallet address is already used by another user
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser && existingUser.id !== req.user.id) {
      throw new AppError('This wallet address is already linked to another account', 400);
    }
    
    // Update user wallet address
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { walletAddress },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user wallet balance
export const getWalletBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (!user.walletAddress) {
      throw new AppError('User has not connected a wallet yet', 400);
    }
    
    // In a real application, this should query the latest balance on the blockchain
    // Simplified here to return the balance stored in the database
    
    res.status(200).json({
      status: 'success',
      data: {
        balance: user.aibBalance,
        walletAddress: user.walletAddress,
        currency: 'AIB'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user transaction history
export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Query transactions where user is sender or recipient
    const transactions = await Transaction.find({
      $or: [
        { senderId: req.user.id },
        { recipientId: req.user.id }
      ]
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('mcpId', 'name version')
      .populate('senderId', 'name')
      .populate('recipientId', 'name');
      
    // Get total transaction count
    const total = await Transaction.countDocuments({
      $or: [
        { senderId: req.user.id },
        { recipientId: req.user.id }
      ]
    });
    
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      total,
      data: {
        transactions
      },
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw tokens
export const withdrawTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { amount, destinationAddress } = req.body;
    
    if (!amount || amount <= 0) {
      throw new AppError('Please provide a valid withdrawal amount', 400);
    }
    
    if (!destinationAddress) {
      throw new AppError('Please provide a destination wallet address', 400);
    }
    
    const user = await User.findById(req.user.id).session(session);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    if (!user.walletAddress) {
      throw new AppError('User has not connected a wallet yet', 400);
    }
    
    // Check if balance is sufficient
    if (user.aibBalance < amount) {
      throw new AppError('Insufficient balance', 400);
    }
    
    // In a real application, this should call a smart contract for on-chain transfer
    // Simplified here to update the balance in the database
    
    // Deduct user balance
    user.aibBalance -= amount;
    await user.save({ session });
    
    // Create withdrawal transaction record
    const transaction = await Transaction.create({
      transactionId: `WD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      type: 'withdraw',
      amount,
      currency: 'AIB',
      senderId: user.id,
      recipientId: user.id, // Self withdrawal to external wallet
      status: 'completed',
      timestamp: new Date(),
      completedAt: new Date(),
      metadata: {
        destinationAddress,
        network: destinationAddress.startsWith('0x') ? 'ethereum' : 'solana'
      }
    });
    
    await transaction.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      status: 'success',
      data: {
        transaction
      }
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get user earnings overview
export const getEarningsOverview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Query user's MCPs
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Calculate total earnings
    const totalEarned = user.revenueHistory.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate earnings by source
    const sourceBreakdown = user.revenueHistory.reduce((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = 0;
      }
      acc[item.source] += item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Get recent earnings records
    const recentEarnings = user.revenueHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalEarned,
        sourceBreakdown,
        recentEarnings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get specific MCP earnings
export const getMcpEarnings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    
    if (!mcpId) {
      throw new AppError('Please provide MCP ID', 400);
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Filter earnings for the specific MCP
    const mcpEarnings = user.revenueHistory.filter(
      item => item.mcpId.toString() === mcpId
    );
    
    // Calculate total earnings for this MCP
    const totalEarned = mcpEarnings.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate earnings by source for this MCP
    const sourceBreakdown = mcpEarnings.reduce((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = 0;
      }
      acc[item.source] += item.amount;
      return acc;
    }, {} as Record<string, number>);
    
    res.status(200).json({
      status: 'success',
      data: {
        mcpId,
        totalEarned,
        sourceBreakdown,
        earnings: mcpEarnings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update payment settings
export const updatePaymentSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { preferredCurrency, autoWithdraw, withdrawThreshold } = req.body;
    
    // Build update object with only provided fields
    const updateData: any = {};
    
    if (preferredCurrency) {
      // Validate currency
      if (!['AIB', 'ETH', 'SOL', 'USD'].includes(preferredCurrency)) {
        throw new AppError('Unsupported currency type', 400);
      }
      updateData['paymentSettings.preferredCurrency'] = preferredCurrency;
    }
    
    if (autoWithdraw !== undefined) {
      if (typeof autoWithdraw !== 'boolean') {
        throw new AppError('Auto withdraw must be a boolean', 400);
      }
      updateData['paymentSettings.autoWithdraw'] = autoWithdraw;
    }
    
    if (withdrawThreshold !== undefined) {
      if (typeof withdrawThreshold !== 'number' || withdrawThreshold < 10) {
        throw new AppError('Withdrawal threshold must be a number and at least 10', 400);
      }
      updateData['paymentSettings.withdrawThreshold'] = withdrawThreshold;
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        paymentSettings: user.paymentSettings
      }
    });
  } catch (error) {
    next(error);
  }
}; 