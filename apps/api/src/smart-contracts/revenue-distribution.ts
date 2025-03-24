/**
 * Revenue Distribution Smart Contract for AIBridge
 * 
 * This contract handles the automatic distribution of revenue to MCP contributors
 * based on their defined revenue shares.
 */

import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { AIBTokenManager } from './aib-token';
import logger from '../utils/logger';

/**
 * Contributor definition
 */
export interface Contributor {
  userId: string;
  walletAddress: string;
  revenueShare: number; // Percentage (0-100)
}

/**
 * Revenue Distribution Manager
 * Handles the distribution of revenue to MCP contributors
 */
export class RevenueDistributionManager {
  private connection: web3.Connection;
  private tokenManager: AIBTokenManager;
  private payer: web3.Keypair;

  /**
   * Constructor
   * @param tokenManager AIB Token Manager instance
   * @param rpcUrl Solana RPC URL (defaults to devnet)
   * @param payerPrivateKey Payer private key in base58 format
   */
  constructor(
    tokenManager: AIBTokenManager,
    rpcUrl: string = web3.clusterApiUrl('devnet'),
    payerPrivateKey?: Uint8Array
  ) {
    // Initialize connection to Solana
    this.connection = new web3.Connection(rpcUrl, 'confirmed');
    this.tokenManager = tokenManager;

    // Initialize payer
    this.payer = payerPrivateKey 
      ? web3.Keypair.fromSecretKey(payerPrivateKey)
      : web3.Keypair.generate();
  }

  /**
   * Distribute revenue to contributors
   * @param contributors List of contributors
   * @param totalAmount Total amount to distribute (in token units)
   * @returns Transaction signatures and distribution records
   */
  public async distributeRevenue(
    contributors: Contributor[],
    totalAmount: number
  ): Promise<{ 
    signatures: string[],
    distributions: {
      userId: string,
      walletAddress: string,
      amount: number
    }[]
  }> {
    try {
      // Validate total revenue shares = 100%
      const totalShares = contributors.reduce((sum, contrib) => sum + contrib.revenueShare, 0);
      
      if (Math.abs(totalShares - 100) > 0.01) {
        throw new Error(`Total revenue shares must equal 100%, got ${totalShares}%`);
      }

      const signatures: string[] = [];
      const distributions: { userId: string, walletAddress: string, amount: number }[] = [];

      // Process each contributor
      for (const contributor of contributors) {
        // Calculate contributor's amount
        const contributorAmount = (contributor.revenueShare / 100) * totalAmount;
        
        if (contributorAmount <= 0) {
          logger.warn(`Skipping zero amount distribution to ${contributor.userId}`);
          continue;
        }

        // Convert wallet address string to PublicKey
        const recipientAddress = new web3.PublicKey(contributor.walletAddress);

        // Transfer tokens to contributor
        const signature = await this.tokenManager.mintTokens(
          recipientAddress,
          contributorAmount
        );

        signatures.push(signature);
        distributions.push({
          userId: contributor.userId,
          walletAddress: contributor.walletAddress,
          amount: contributorAmount
        });

        logger.info(`Distributed ${contributorAmount} AIB to ${contributor.userId} (${contributor.walletAddress})`);
      }

      return { signatures, distributions };
    } catch (error) {
      logger.error('Failed to distribute revenue:', error);
      throw error;
    }
  }

  /**
   * Batch distribute revenue for multiple MCPs
   * @param mcpDistributions List of MCP distributions
   * @returns Distribution results by MCP ID
   */
  public async batchDistributeRevenue(
    mcpDistributions: {
      mcpId: string,
      contributors: Contributor[],
      amount: number
    }[]
  ): Promise<{ 
    [mcpId: string]: {
      signatures: string[],
      distributions: {
        userId: string,
        walletAddress: string,
        amount: number
      }[]
    } 
  }> {
    try {
      const results: { 
        [mcpId: string]: {
          signatures: string[],
          distributions: {
            userId: string,
            walletAddress: string,
            amount: number
          }[]
        } 
      } = {};

      // Process each MCP
      for (const { mcpId, contributors, amount } of mcpDistributions) {
        try {
          const result = await this.distributeRevenue(contributors, amount);
          results[mcpId] = result;
        } catch (error) {
          logger.error(`Failed to distribute revenue for MCP ${mcpId}:`, error);
          results[mcpId] = {
            signatures: [],
            distributions: []
          };
        }
      }

      return results;
    } catch (error) {
      logger.error('Failed to batch distribute revenue:', error);
      throw error;
    }
  }

  /**
   * Verify if a wallet is eligible to receive funds
   * @param walletAddress Wallet address to verify
   * @returns Boolean indicating if the wallet is valid and can receive tokens
   */
  public async verifyWallet(walletAddress: string): Promise<boolean> {
    try {
      // Validate address format
      try {
        new web3.PublicKey(walletAddress);
      } catch (error) {
        logger.error(`Invalid wallet address format: ${walletAddress}`);
        return false;
      }

      // For a more thorough validation, we could check:
      // 1. If the wallet exists (has been used before)
      // 2. If it can receive SPL tokens
      // But for simplicity, we'll just validate the format

      return true;
    } catch (error) {
      logger.error(`Failed to verify wallet ${walletAddress}:`, error);
      return false;
    }
  }
}

// Export factory function
export const createRevenueDistributionManager = (
  tokenManager: AIBTokenManager,
  rpcUrl?: string,
  payerPrivateKey?: Uint8Array
): RevenueDistributionManager => {
  return new RevenueDistributionManager(tokenManager, rpcUrl, payerPrivateKey);
};

export default createRevenueDistributionManager; 