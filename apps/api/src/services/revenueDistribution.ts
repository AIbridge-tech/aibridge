import mongoose from 'mongoose';
import User from '../models/user';
import MCP from '../models/mcp';
import Transaction from '../models/transaction';
import { createAIBTokenManager } from '../smart-contracts/aib-token';
import { createRevenueDistributionManager, Contributor } from '../smart-contracts/revenue-distribution';
import logger from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

/**
 * Revenue Distribution Service
 * Handles the distribution of revenue to MCP contributors
 */
class RevenueDistributionService {
  /**
   * Distribute MCP revenue to contributors
   * @param mcpId MCP ID
   * @param amount Amount to distribute
   * @param source Revenue source (download, usage, reward, referral, subscription)
   * @returns Array of transaction records
   */
  async distributeMcpRevenue(
    mcpId: string,
    amount: number,
    source: 'download' | 'usage' | 'reward' | 'referral' | 'subscription'
  ): Promise<any[]> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find MCP and verify it exists
      const mcp = await MCP.findById(mcpId).session(session);
      
      if (!mcp) {
        throw new AppError('MCP not found', 404);
      }

      // Check if MCP has contributors
      if (!mcp.contributors || mcp.contributors.length === 0) {
        throw new AppError('MCP has no contributors defined', 400);
      }

      // Get contributor details including wallet addresses
      const contributorIds = mcp.contributors.map(c => c.userId);
      const users = await User.find({ _id: { $in: contributorIds } })
        .select('_id walletAddress')
        .session(session);

      // Map users to their wallet addresses
      const userWallets = users.reduce((map, user) => {
        map[user._id.toString()] = user.walletAddress;
        return map;
      }, {} as Record<string, string>);

      // Format contributors for the distribution manager
      const contributors: Contributor[] = mcp.contributors
        .filter(contributor => userWallets[contributor.userId.toString()])
        .map(contributor => ({
          userId: contributor.userId.toString(),
          walletAddress: userWallets[contributor.userId.toString()],
          revenueShare: contributor.revenueShare
        }));

      if (contributors.length === 0) {
        throw new AppError('No contributors with valid wallet addresses found', 400);
      }

      // Initialize token manager and distribution manager
      const tokenManager = createAIBTokenManager();
      const distributionManager = createRevenueDistributionManager(tokenManager);

      // Distribute revenue
      const { distributions } = await distributionManager.distributeRevenue(
        contributors,
        amount
      );

      // Create transaction records
      const transactions = [];
      
      for (const distribution of distributions) {
        const transaction = await Transaction.create([{
          transactionId: `mcp-revenue-${mcpId}-${Date.now()}-${distribution.userId}`,
          type: 'royalty',
          amount: distribution.amount,
          currency: 'AIB',
          senderId: null, // System
          recipientId: new mongoose.Types.ObjectId(distribution.userId),
          mcpId: new mongoose.Types.ObjectId(mcpId),
          status: 'completed',
          timestamp: new Date(),
          completedAt: new Date(),
          metadata: {
            source,
            revenueShare: `${distribution.amount / amount * 100}%`,
            walletAddress: distribution.walletAddress
          }
        }], { session });

        transactions.push(transaction[0]);
      }

      // Update MCP revenue stats
      await MCP.findByIdAndUpdate(mcpId, {
        $inc: { 'revenueStats.totalEarned': amount },
        $set: { 'revenueStats.lastPayout': new Date() }
      }, { session });

      // Update user revenue history for each contributor
      for (const distribution of distributions) {
        await User.findByIdAndUpdate(distribution.userId, {
          $push: {
            revenueHistory: {
              amount: distribution.amount,
              currency: 'AIB',
              source,
              mcpId: new mongoose.Types.ObjectId(mcpId),
              timestamp: new Date()
            }
          }
        }, { session });
      }

      // Commit transaction
      await session.commitTransaction();
      
      logger.info(`Successfully distributed ${amount} AIB for MCP ${mcpId}`);
      
      return transactions;
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      logger.error('Failed to distribute MCP revenue:', error);
      throw error;
    } finally {
      // End session
      session.endSession();
    }
  }

  /**
   * Update contributor revenue shares for an MCP
   * @param mcpId MCP ID
   * @param contributors Array of contributors with revenue shares
   * @returns Updated MCP document
   */
  async updateContributorShares(
    mcpId: string,
    contributors: {
      userId: string;
      role: string;
      revenueShare: number;
    }[]
  ): Promise<any> {
    try {
      // Validate total shares = 100%
      const totalShares = contributors.reduce((sum, contributor) => sum + contributor.revenueShare, 0);
      
      if (Math.abs(totalShares - 100) > 0.1) {
        throw new AppError(`Total revenue shares must equal 100%, got ${totalShares}%`, 400);
      }

      // Update MCP contributors
      const updatedMcp = await MCP.findByIdAndUpdate(
        mcpId,
        {
          $set: {
            contributors: contributors.map(contributor => ({
              userId: new mongoose.Types.ObjectId(contributor.userId),
              role: contributor.role,
              revenueShare: contributor.revenueShare,
              joinedAt: new Date() // For new contributors, this will be the current date
            }))
          }
        },
        { new: true }
      );

      if (!updatedMcp) {
        throw new AppError('MCP not found', 404);
      }

      logger.info(`Updated revenue shares for MCP ${mcpId}`);
      
      return updatedMcp;
    } catch (error) {
      logger.error('Failed to update contributor shares:', error);
      throw error;
    }
  }

  /**
   * Process automatic payouts for eligible users
   * @returns Number of processed payouts
   */
  async processAutomaticPayouts(): Promise<number> {
    try {
      // Find users with autoWithdraw enabled and pending amounts above threshold
      const eligibleUsers = await User.find({
        'paymentSettings.autoWithdraw': true,
        'paymentSettings.withdrawThreshold': { $gt: 0 },
        walletAddress: { $exists: true, $ne: '' }
      });

      logger.info(`Found ${eligibleUsers.length} users eligible for automatic payouts`);
      
      let processedCount = 0;
      
      // For each eligible user, calculate pending amount
      for (const user of eligibleUsers) {
        try {
          // Get user's revenue history to calculate pending amount
          const pendingAmount = await this.calculatePendingAmount(user._id);
          
          // Check if pending amount exceeds threshold
          if (pendingAmount >= user.paymentSettings.withdrawThreshold) {
            // Process withdrawal
            await this.processWithdrawal(user._id, pendingAmount);
            processedCount++;
          }
        } catch (error) {
          logger.error(`Failed to process automatic payout for user ${user._id}:`, error);
          // Continue with next user
        }
      }

      logger.info(`Successfully processed ${processedCount} automatic payouts`);
      
      return processedCount;
    } catch (error) {
      logger.error('Failed to process automatic payouts:', error);
      throw error;
    }
  }

  /**
   * Calculate pending amount for a user
   * @param userId User ID
   * @returns Pending amount
   */
  private async calculatePendingAmount(userId: mongoose.Types.ObjectId): Promise<number> {
    try {
      // Get sum of all earnings
      const totalEarnings = await Transaction.aggregate([
        {
          $match: {
            recipientId: userId,
            status: 'completed',
            type: 'royalty'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      // Get sum of all withdrawals
      const totalWithdrawals = await Transaction.aggregate([
        {
          $match: {
            senderId: userId,
            status: 'completed',
            type: 'withdrawal'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const earnings = totalEarnings.length > 0 ? totalEarnings[0].total : 0;
      const withdrawals = totalWithdrawals.length > 0 ? totalWithdrawals[0].total : 0;
      
      // Pending amount = earnings - withdrawals
      return earnings - withdrawals;
    } catch (error) {
      logger.error(`Failed to calculate pending amount for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Process withdrawal for a user
   * @param userId User ID
   * @param amount Amount to withdraw
   * @returns Transaction record
   */
  private async processWithdrawal(userId: mongoose.Types.ObjectId, amount: number): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get user details
      const user = await User.findById(userId).session(session);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!user.walletAddress) {
        throw new AppError('User has no wallet address', 400);
      }

      // Create withdrawal transaction
      const transaction = await Transaction.create([{
        transactionId: `withdrawal-${userId}-${Date.now()}`,
        type: 'withdrawal',
        amount,
        currency: 'AIB',
        senderId: userId,
        recipientId: null, // External wallet
        mcpId: null,
        status: 'completed',
        timestamp: new Date(),
        completedAt: new Date(),
        metadata: {
          walletAddress: user.walletAddress,
          method: 'automatic'
        }
      }], { session });

      // Update user AIB balance
      await User.findByIdAndUpdate(userId, {
        $inc: { aibBalance: -amount }
      }, { session });

      // Commit transaction
      await session.commitTransaction();
      
      logger.info(`Successfully processed withdrawal of ${amount} AIB for user ${userId}`);
      
      return transaction[0];
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      logger.error(`Failed to process withdrawal for user ${userId}:`, error);
      throw error;
    } finally {
      // End session
      session.endSession();
    }
  }
}

export const revenueDistributionService = new RevenueDistributionService(); 