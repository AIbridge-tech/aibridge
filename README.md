# AIbridge Platform

<div align="center">
  <img src="docs/assets/logo.png" alt="AIbridge Logo" width="250">
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Website](https://img.shields.io/badge/Website-ai--bridge.tech-blue)](https://ai-bridge.tech)
  [![Twitter](https://img.shields.io/badge/Twitter-@AI__Bridge__-blue)](https://x.com/AI_Bridge_)
  [![GitHub](https://img.shields.io/badge/GitHub-AIbridge--tech-blue)](https://github.com/AIbridge-tech/aibridge)
</div>

## 🔑 Overview

AIbridge is a decentralized platform that connects AI model creators with developers through a marketplace of Magic Copy-Paste (MCP) components, providing incentives through a revenue distribution system built on Solana blockchain technology.

### Key Features

- **MCP Marketplace**: Discover, search, and integrate AI components
- **Revenue Distribution**: Solana-based token system for fair compensation
- **Creator Dashboard**: Track earnings, downloads, and usage metrics
- **Contributor Management**: Share revenue with team members
- **API Integration**: Simple developer integration with documentation
- **Admin Controls**: Content moderation and quality assurance

## 🏗️ System Architecture

AIbridge employs a modern, scalable architecture designed for performance, security, and flexibility.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        User & Developer Experience                      │
├─────────────┬─────────────────┬───────────────────┬─────────────────────┤
│ MCP Creator │ Revenue &       │  MCP Management   │  User Center &      │
│ Workbench   │ Analytics Panel │  Console          │  Authentication     │
├─────────────┴─────────────────┴───────────────────┴─────────────────────┤
│                        Platform Services                                │
├─────────────┬─────────────────┬───────────────────┬─────────────────────┤
│   MCP       │   Wallet        │  API Management   │  Admin              │
│   Market    │   System        │  & Integration    │  Control Panel      │
├─────────────┴─────────────────┴───────────────────┴─────────────────────┤
│                        Core Business Logic                              │
├─────────────┬─────────────────┬───────────────────┬─────────────────────┤
│ MCP Approval│ Revenue         │  Transaction      │  Content            │
│ Process     │ Distribution    │  Processing       │  Moderation         │
├─────────────┴─────────────────┴───────────────────┴─────────────────────┤
│                        Infrastructure                                   │
├─────────────┬─────────────────┬───────────────────┬─────────────────────┤
│ Security &  │   MongoDB       │  Solana           │  Express            │
│ Auth        │   Storage       │  Blockchain       │  API Service        │
└─────────────┴─────────────────┴───────────────────┴─────────────────────┘
```

## 💻 Technical Stack

AIbridge leverages modern technologies for robust performance and scalability:

### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context and Hooks
- **Authentication**: JWT with secure HTTP-only cookies
- **API Integration**: Axios for data fetching

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **API Documentation**: OpenAPI (Swagger)
- **Logging**: Winston for structured logs

### Blockchain Integration
- **Network**: Solana (development/testnet)
- **Token Standard**: SPL Token (AIB token)
- **Smart Contracts**: Native Solana programs for token and revenue distribution
- **Wallet Integration**: Web3.js for Solana blockchain interaction

## 📊 Data Models

### Core Data Models

#### User Model
```javascript
{
  name: String,                    // User's name
  email: String,                   // Unique email (required)
  password: String,                // Hashed password
  role: 'user'|'admin'|'creator',  // User role
  status: 'active'|'inactive'|'suspended',
  walletAddress: String,           // Solana wallet address
  aibBalance: Number,              // AIB token balance
  revenueHistory: [{               // Revenue history
    amount: Number,                // Amount earned
    currency: String,              // Token type
    source: String,                // Revenue source
    mcpId: ObjectId,               // Related MCP
    timestamp: Date                // When recorded
  }],
  paymentSettings: {
    preferredCurrency: String,     // Payment currency
    autoWithdraw: Boolean,         // Auto withdrawal
    withdrawThreshold: Number      // Minimum withdrawal
  }
}
```

#### MCP Model
```javascript
{
  name: String,                    // MCP name
  description: String,             // Detailed description
  version: String,                 // Version number
  category: String,                // Category
  tags: [String],                  // Searchable tags
  functions: [{                    // API functions
    name: String,                  // Function name
    description: String,           // Description
    parameters: [{                 // Parameters
      name: String,                // Parameter name
      type: String,                // Data type
      description: String          // Parameter description
    }],
    returnType: String,            // Return type
    examples: [String]             // Example usage
  }],
  owner: ObjectId,                 // MCP owner reference
  downloads: Number,               // Download count
  contributors: [{                 // Contributors list
    userId: ObjectId,              // User ID
    role: String,                  // Contributor role
    revenueShare: Number,          // Revenue percentage
    joinedAt: Date                 // Join date
  }],
  monetization: {                  // Monetization settings
    model: String,                 // Free/paid/subscription
    price: Number,                 // Price if applicable
    subscriptionTiers: [{          // Subscription options
      name: String,                // Tier name
      price: Number,               // Tier price
      callLimit: Number,           // API call limit
      features: [String]           // Feature list
    }],
    customRoyalty: Number          // Custom royalty percentage
  },
  revenueStats: {                  // Revenue tracking
    totalEarned: Number,           // Total revenue earned
    lastPayout: Date,              // Last payout date
    pendingAmount: Number          // Pending revenue
  }
}
```

#### Transaction Model
```javascript
{
  transactionId: String,           // Unique transaction ID
  type: String,                    // Transaction type
  amount: Number,                  // Amount
  currency: String,                // Currency
  senderId: ObjectId,              // Sender reference
  recipientId: ObjectId,           // Recipient reference
  mcpId: ObjectId,                 // Related MCP
  status: String,                  // Transaction status
  timestamp: Date,                 // Creation time
  completedAt: Date,               // Completion time
  metadata: Object                 // Additional data
}
```

## 🔄 Data Flow

### MCP Creation and Distribution

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  Creator  │────▶│    MCP    │────▶│  Approval │────▶│ Marketplace│
│  Uploads  │     │  Creation │     │  Process  │     │  Listing   │
└───────────┘     └───────────┘     └───────────┘     └───────────┘
                                                             │
┌───────────┐     ┌───────────┐     ┌───────────┐           ▼
│  Revenue  │◀────│  Token    │◀────│   User    │◀────┌───────────┐
│Distribution│     │ Transfer  │     │ Download/ │     │Developer  │
└───────────┘     └───────────┘     │   Usage   │     │Integration │
                                    └───────────┘     └───────────┘
```

### Revenue Distribution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Transaction Initiated                    │
│ (User purchase, subscription payment, usage-based charging)  │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Revenue Distribution Contract              │
│       Calculates shares based on contributor settings        │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      AIB Token Contract                      │
│            Transfers tokens to contributor wallets           │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Transaction Record Creation                 │
│       Stores transaction details for accounting/history      │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   User Balance/Stats Update                  │
│        Updates balances and statistics for all parties       │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Smart Contract Implementation

AIbridge implements two key smart contracts on Solana:

### AIB Token Contract

The AIB token contract (based on Solana's SPL token standard) provides:

1. **Token Creation**: Mints the AIB token with controlled supply
2. **Transfer Operations**: Secure transfer of tokens between wallets
3. **Balance Management**: Tracking balances across the platform
4. **Permission Controls**: Ensures only authorized operations

Code example from implementation:
```typescript
public async mintTokens(
  recipient: web3.PublicKey,
  amount: number
): Promise<string> {
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
    amount * (10 ** TOKEN_DECIMALS)
  );

  return signature;
}
```

### Revenue Distribution Contract

The revenue distribution contract handles:

1. **Automatic Distribution**: Splits revenue based on contributor shares
2. **Multi-party Payments**: Supports multiple contributors per MCP
3. **Verification**: Validates wallet addresses and permissions
4. **Batch Processing**: Efficiently processes multiple distributions

Code example from implementation:
```typescript
public async distributeRevenue(
  contributors: Contributor[],
  totalAmount: number
): Promise<{ 
  signatures: string[],
  distributions: { userId: string, walletAddress: string, amount: number }[]
}> {
  // Validate total revenue shares = 100%
  const totalShares = contributors.reduce((sum, contrib) => sum + contrib.revenueShare, 0);
  
  if (Math.abs(totalShares - 100) > 0.01) {
    throw new Error(`Total revenue shares must equal 100%, got ${totalShares}%`);
  }

  const signatures: string[] = [];
  const distributions: { userId: string, walletAddress: string, amount: number }[] = [];

  // Process each contributor
  for (const contributor of contributors) {
    const contributorAmount = (contributor.revenueShare / 100) * totalAmount;
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
  }

  return { signatures, distributions };
}
```

## 🔒 Security Features

AIbridge implements comprehensive security measures:

1. **Authentication**
   - JWT-based authentication with secure cookies
   - Password hashing with bcrypt (12 rounds)
   - Multi-factor authentication support

2. **Authorization**
   - Role-based access control (user, creator, admin)
   - Resource-level permissions
   - API endpoint security

3. **Blockchain Security**
   - Wallet address validation
   - Transaction signing verification
   - Rate limiting for contract interactions

4. **Data Protection**
   - Input validation and sanitization
   - Protection against common web vulnerabilities
   - Secure API design with proper error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Solana CLI tools

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/AIbridge-tech/aibridge.git
   cd aibridge
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run development servers:
   ```
   # Backend API
   npm run dev:api
   
   # Frontend
   npm run dev:web
   ```

## 📋 Implementation Progress

See [implementation-plan.md](implementation-plan.md) for the detailed implementation plan and current progress.

### Completed (v0.1.0)
- ✅ User authentication and registration system
- ✅ User profile management
- ✅ MCP creation and management interface
- ✅ MCP versioning system
- ✅ MCP documentation integration
- ✅ Admin dashboard with MCP approval management
- ✅ Basic marketplace interface
- ✅ Revenue distribution logic implementation
- ✅ Token contract implementation
- ✅ Revenue distribution contract implementation

### Upcoming (v0.2.0)
- Token balance query implementation
- Withdrawal functionality API implementation
- Responsive design improvements
- TypeScript strict mode error fixes
- Smart contract deployment to testnet
- Performance optimizations
- Comprehensive testing suite
- Deployment pipeline setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

- [AIbridge Team](https://github.com/AIbridge-tech) 