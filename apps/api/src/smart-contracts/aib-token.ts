/**
 * AIB Token Smart Contract - Solana SPL Token Implementation
 * 
 * This file contains the implementation for creating and managing the AIB token
 * as a Solana SPL token. It includes functions for initialization, minting,
 * transferring, and burning tokens.
 */

import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import logger from '../utils/logger';

// Constants
const TOKEN_DECIMALS = 6; // 6 decimal places like USDC
const TOKEN_NAME = 'AI Bridge Token';
const TOKEN_SYMBOL = 'AIB';
const INITIAL_SUPPLY = 10_000_000; // 10 million tokens

/**
 * AIB Token Manager
 * Handles creation and management of the AIB token
 */
export class AIBTokenManager {
  private connection: web3.Connection;
  private tokenMint: web3.PublicKey | null = null;
  private mintAuthority: web3.Keypair;
  private payer: web3.Keypair;

  /**
   * Constructor
   * @param rpcUrl Solana RPC URL (defaults to devnet)
   * @param payerPrivateKey Payer private key in base58 format
   * @param mintAuthorityPrivateKey Mint authority private key in base58 format
   */
  constructor(
    rpcUrl: string = web3.clusterApiUrl('devnet'),
    payerPrivateKey?: Uint8Array,
    mintAuthorityPrivateKey?: Uint8Array
  ) {
    // Initialize connection to Solana
    this.connection = new web3.Connection(rpcUrl, 'confirmed');

    // Initialize payer and mint authority
    this.payer = payerPrivateKey 
      ? web3.Keypair.fromSecretKey(payerPrivateKey)
      : web3.Keypair.generate();
    
    this.mintAuthority = mintAuthorityPrivateKey
      ? web3.Keypair.fromSecretKey(mintAuthorityPrivateKey)
      : web3.Keypair.generate();
  }

  /**
   * Get token mint public key
   * @returns Token mint public key
   */
  public getTokenMint(): web3.PublicKey | null {
    return this.tokenMint;
  }

  /**
   * Get payer public key
   * @returns Payer public key
   */
  public getPayerPublicKey(): web3.PublicKey {
    return this.payer.publicKey;
  }

  /**
   * Get mint authority public key
   * @returns Mint authority public key
   */
  public getMintAuthorityPublicKey(): web3.PublicKey {
    return this.mintAuthority.publicKey;
  }

  /**
   * Request airdrop of SOL for testing (only on devnet/testnet)
   * @param amount Amount of SOL to airdrop (in lamports)
   * @returns Transaction signature
   */
  public async requestAirdrop(amount: number = 1 * web3.LAMPORTS_PER_SOL): Promise<string> {
    try {
      const signature = await this.connection.requestAirdrop(
        this.payer.publicKey,
        amount
      );

      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');
      logger.info(`Airdropped ${amount / web3.LAMPORTS_PER_SOL} SOL to ${this.payer.publicKey.toString()}`);
      
      return signature;
    } catch (error) {
      logger.error('Failed to request airdrop:', error);
      throw error;
    }
  }

  /**
   * Create new AIB token
   * @returns Token mint public key
   */
  public async createToken(): Promise<web3.PublicKey> {
    try {
      // Create new token mint
      this.tokenMint = await splToken.createMint(
        this.connection,
        this.payer,
        this.mintAuthority.publicKey,
        this.mintAuthority.publicKey, // Freeze authority (same as mint authority)
        TOKEN_DECIMALS
      );

      logger.info(`Token created: ${this.tokenMint.toString()}`);

      // Set token metadata
      await this.setTokenMetadata();

      return this.tokenMint;
    } catch (error) {
      logger.error('Failed to create token:', error);
      throw error;
    }
  }

  /**
   * Set token metadata
   * @returns Transaction signature
   */
  private async setTokenMetadata(): Promise<string> {
    try {
      // In a real implementation, this would use the Metaplex Token Metadata Program
      // to set the token metadata. For simplicity, we're just logging it here.
      logger.info(`Setting token metadata: ${TOKEN_NAME} (${TOKEN_SYMBOL})`);
      
      return 'metadata-transaction-signature';
    } catch (error) {
      logger.error('Failed to set token metadata:', error);
      throw error;
    }
  }

  /**
   * Mint tokens to a recipient
   * @param recipient Recipient public key
   * @param amount Amount to mint (in token units, not including decimals)
   * @returns Transaction signature
   */
  public async mintTokens(
    recipient: web3.PublicKey,
    amount: number
  ): Promise<string> {
    try {
      if (!this.tokenMint) {
        throw new Error('Token mint not initialized');
      }

      // Create or get recipient token account
      const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        recipient
      );

      // Mint tokens to recipient
      const signature = await splToken.mintTo(
        this.connection,
        this.payer,
        this.tokenMint,
        recipientTokenAccount.address,
        this.mintAuthority,
        amount * (10 ** TOKEN_DECIMALS) // Convert to token units with decimals
      );

      logger.info(`Minted ${amount} tokens to ${recipient.toString()}`);
      return signature;
    } catch (error) {
      logger.error('Failed to mint tokens:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens from one account to another
   * @param sender Sender public key
   * @param recipient Recipient public key
   * @param amount Amount to transfer (in token units, not including decimals)
   * @param senderPrivateKey Sender private key
   * @returns Transaction signature
   */
  public async transferTokens(
    sender: web3.PublicKey,
    recipient: web3.PublicKey,
    amount: number,
    senderPrivateKey: Uint8Array
  ): Promise<string> {
    try {
      if (!this.tokenMint) {
        throw new Error('Token mint not initialized');
      }

      const senderKeypair = web3.Keypair.fromSecretKey(senderPrivateKey);

      // Get sender token account
      const senderTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        sender
      );

      // Get recipient token account
      const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        recipient
      );

      // Transfer tokens
      const signature = await splToken.transfer(
        this.connection,
        this.payer,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        senderKeypair,
        amount * (10 ** TOKEN_DECIMALS) // Convert to token units with decimals
      );

      logger.info(`Transferred ${amount} tokens from ${sender.toString()} to ${recipient.toString()}`);
      return signature;
    } catch (error) {
      logger.error('Failed to transfer tokens:', error);
      throw error;
    }
  }

  /**
   * Burn tokens
   * @param owner Token owner public key
   * @param amount Amount to burn (in token units, not including decimals)
   * @param ownerPrivateKey Owner private key
   * @returns Transaction signature
   */
  public async burnTokens(
    owner: web3.PublicKey,
    amount: number,
    ownerPrivateKey: Uint8Array
  ): Promise<string> {
    try {
      if (!this.tokenMint) {
        throw new Error('Token mint not initialized');
      }

      const ownerKeypair = web3.Keypair.fromSecretKey(ownerPrivateKey);

      // Get owner token account
      const ownerTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        owner
      );

      // Burn tokens
      const signature = await splToken.burn(
        this.connection,
        this.payer,
        ownerTokenAccount.address,
        this.tokenMint,
        ownerKeypair,
        amount * (10 ** TOKEN_DECIMALS) // Convert to token units with decimals
      );

      logger.info(`Burned ${amount} tokens from ${owner.toString()}`);
      return signature;
    } catch (error) {
      logger.error('Failed to burn tokens:', error);
      throw error;
    }
  }

  /**
   * Get token balance
   * @param owner Token owner public key
   * @returns Token balance (in token units, including decimals)
   */
  public async getTokenBalance(owner: web3.PublicKey): Promise<number> {
    try {
      if (!this.tokenMint) {
        throw new Error('Token mint not initialized');
      }

      // Get owner token account
      const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        owner
      );

      // Get token balance
      const balance = await this.connection.getTokenAccountBalance(tokenAccount.address);
      
      logger.info(`Token balance for ${owner.toString()}: ${balance.value.uiAmount}`);
      return balance.value.uiAmount || 0;
    } catch (error) {
      logger.error('Failed to get token balance:', error);
      throw error;
    }
  }
}

// Export singleton instance creator
export const createAIBTokenManager = (
  rpcUrl?: string,
  payerPrivateKey?: Uint8Array,
  mintAuthorityPrivateKey?: Uint8Array
): AIBTokenManager => {
  return new AIBTokenManager(rpcUrl, payerPrivateKey, mintAuthorityPrivateKey);
};

export default createAIBTokenManager; 