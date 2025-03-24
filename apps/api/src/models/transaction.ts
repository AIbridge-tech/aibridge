import mongoose, { Schema, Document } from 'mongoose';

// Transaction Document interface
export interface ITransaction extends Document {
  transactionId: string;
  type: 'purchase' | 'subscription' | 'royalty' | 'reward' | 'withdrawal';
  amount: number;
  currency: string;
  senderId: mongoose.Types.ObjectId | null;
  recipientId: mongoose.Types.ObjectId | null;
  mcpId: mongoose.Types.ObjectId | null;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  completedAt: Date | null;
  metadata: Record<string, any>;
}

// Transaction schema
const TransactionSchema: Schema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['purchase', 'subscription', 'royalty', 'reward', 'withdrawal']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'AIB'
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  mcpId: {
    type: Schema.Types.ObjectId,
    ref: 'MCP',
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for faster queries
TransactionSchema.index({ transactionId: 1 });
TransactionSchema.index({ senderId: 1 });
TransactionSchema.index({ recipientId: 1 });
TransactionSchema.index({ mcpId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ timestamp: -1 });

// Generate unique transaction ID
TransactionSchema.pre('save', async function(next) {
  // Skip if transaction ID already exists
  if (this.transactionId) {
    return next();
  }
  
  // Generate unique ID: timestamp + 6 random characters
  const timestamp = Date.now();
  const randomChars = Math.random().toString(36).substring(2, 8);
  this.transactionId = `tx-${timestamp}-${randomChars}`;
  next();
});

// Add completion time when transaction is completed
TransactionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction; 