import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { revenueDistributionService } from '../services/revenueDistribution';
import MCP from '../models/mcp';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Trigger revenue distribution for an MCP
 * This endpoint allows admin or MCP owner to manually distribute revenue
 */
export const triggerRevenueDistribution = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    const { amount, source } = req.body;
    
    if (!mcpId) {
      throw new AppError('Please provide MCP ID', 400);
    }
    
    if (!amount || amount <= 0) {
      throw new AppError('Please provide a valid amount greater than 0', 400);
    }
    
    if (!source || !['download', 'usage', 'reward', 'referral', 'subscription'].includes(source)) {
      throw new AppError('Please provide a valid revenue source', 400);
    }
    
    // Check if user is authorized to trigger distribution
    const mcp = await MCP.findById(mcpId);
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Only admin or MCP owner can trigger distribution
    if (req.user.role !== 'admin' && mcp.owner.toString() !== req.user.id) {
      throw new AppError('You are not authorized to trigger revenue distribution for this MCP', 403);
    }
    
    // Distribute revenue
    const transactions = await revenueDistributionService.distributeMcpRevenue(
      mcpId,
      amount,
      source as 'download' | 'usage' | 'reward' | 'referral' | 'subscription'
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update contributor revenue shares for an MCP
 */
export const updateContributorShares = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    const { contributors } = req.body;
    
    if (!mcpId) {
      throw new AppError('Please provide MCP ID', 400);
    }
    
    if (!contributors || !Array.isArray(contributors) || contributors.length === 0) {
      throw new AppError('Please provide a valid contributors array', 400);
    }
    
    // Check if user is authorized to update contributor shares
    const mcp = await MCP.findById(mcpId);
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Only admin or MCP owner can update contributor shares
    if (req.user.role !== 'admin' && mcp.owner.toString() !== req.user.id) {
      throw new AppError('You are not authorized to update contributor shares for this MCP', 403);
    }
    
    // Validate contributor data
    for (const contributor of contributors) {
      if (!contributor.userId || !contributor.role || contributor.revenueShare === undefined) {
        throw new AppError('Each contributor must have userId, role, and revenueShare', 400);
      }
      
      if (!['owner', 'collaborator', 'maintainer'].includes(contributor.role)) {
        throw new AppError('Invalid contributor role. Must be owner, collaborator, or maintainer', 400);
      }
      
      if (typeof contributor.revenueShare !== 'number' || contributor.revenueShare < 0 || contributor.revenueShare > 100) {
        throw new AppError('Revenue share must be a number between 0 and 100', 400);
      }
    }
    
    // Update contributor shares
    const updatedMcp = await revenueDistributionService.updateContributorShares(
      mcpId,
      contributors
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        mcp: updatedMcp
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger automatic payouts for eligible users
 * This should be restricted to admin only
 */
export const triggerAutomaticPayouts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Only admin can trigger automatic payouts
    if (req.user.role !== 'admin') {
      throw new AppError('You are not authorized to trigger automatic payouts', 403);
    }
    
    // Process automatic payouts
    const processedCount = await revenueDistributionService.processAutomaticPayouts();
    
    res.status(200).json({
      status: 'success',
      data: {
        processedCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get distribution history for an MCP
 */
export const getMcpDistributionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    if (!mcpId) {
      throw new AppError('Please provide MCP ID', 400);
    }
    
    // Find transactions related to this MCP
    const transactions = await MCP.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(mcpId) } },
      { $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'mcpId',
          as: 'distributions'
        }
      },
      { $unwind: '$distributions' },
      { $match: { 'distributions.type': 'royalty' } },
      { $sort: { 'distributions.timestamp': -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: {
          _id: 0,
          transaction: '$distributions'
        }
      }
    ]);
    
    // Get count of transactions
    const total = await MCP.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(mcpId) } },
      { $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'mcpId',
          as: 'distributions'
        }
      },
      { $unwind: '$distributions' },
      { $match: { 'distributions.type': 'royalty' } },
      { $count: 'total' }
    ]);
    
    const totalCount = total.length > 0 ? total[0].total : 0;
    
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      total: totalCount,
      data: {
        distributions: transactions.map((item: any) => item.transaction)
      },
      pagination: {
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}; 