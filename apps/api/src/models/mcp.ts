import mongoose, { Document, Schema } from 'mongoose';

// Rating interface
interface IRating {
  userId: mongoose.Types.ObjectId;
  userName: string;
  value: number;
  comment: string;
  createdAt: string;
}

// MCP Function interface
interface IMcpFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    description: string;
    required?: boolean;
    schema?: any;
  }[];
  returnType?: string;
  returnDescription?: string;
  examples?: string[];
}

// 贡献者接口
interface IContributor {
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'collaborator' | 'maintainer';
  revenueShare: number;
  joinedAt: Date;
}

// 订阅级别接口
interface ISubscriptionTier {
  name: string;
  price: number;
  callLimit: number;
  features: string[];
}

// 变现设置接口
interface IMonetization {
  model: 'free' | 'paid' | 'subscription';
  price: number;
  subscriptionTiers: ISubscriptionTier[];
  customRoyalty: number;
}

// 收益统计接口
interface IRevenueStats {
  totalEarned: number;
  lastPayout?: Date;
  pendingAmount: number;
}

// MCP Document interface
export interface IMcp extends Document {
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  functions: IMcpFunction[];
  metadata: Record<string, any>;
  isPublic: boolean;
  owner: mongoose.Types.ObjectId;
  downloads: number;
  ratings: IRating[];
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  // 新增字段
  contributors: IContributor[];
  monetization: IMonetization;
  revenueStats: IRevenueStats;
  // 新增方法
  recordDownload(amount: number): Promise<void>;
  recordPayout(amount: number): Promise<void>;
  distributeRevenue(amount: number): Promise<Array<{userId: mongoose.Types.ObjectId, amount: string, share: number}>>;
}

// Rating schema
const RatingSchema = new Schema<IRating>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    default: '',
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

// MCP Function schema
const McpFunctionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  parameters: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      schema: {
        type: Schema.Types.Mixed,
      },
    },
  ],
  returnType: {
    type: String,
  },
  returnDescription: {
    type: String,
  },
  examples: [String],
});

// 贡献者Schema
const ContributorSchema = new Schema<IContributor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'collaborator', 'maintainer'],
    default: 'collaborator',
  },
  revenueShare: {
    type: Number,
    required: true,
    min: [0, '收益分成不能为负数'],
    max: [100, '收益分成不能超过100%'],
    default: 0,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// 订阅级别Schema
const SubscriptionTierSchema = new Schema<ISubscriptionTier>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, '价格不能为负数'],
  },
  callLimit: {
    type: Number,
    required: true,
    min: [0, 'API调用限制不能为负数'],
  },
  features: [String],
});

// MCP schema
const McpSchema = new Schema<IMcp>(
  {
    name: {
      type: String,
      required: [true, 'MCP name is required'],
      trim: true,
      maxlength: [100, 'MCP name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'MCP description is required'],
      trim: true,
      maxlength: [2000, 'MCP description cannot exceed 2000 characters'],
    },
    version: {
      type: String,
      required: [true, 'MCP version is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'MCP category is required'],
      enum: ['text', 'image', 'audio', 'video', 'multimodal', 'other'],
    },
    tags: {
      type: [String],
      default: [],
    },
    functions: {
      type: [McpFunctionSchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: [RatingSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    // 新增字段
    contributors: {
      type: [ContributorSchema],
      default: [],
    },
    monetization: {
      model: {
        type: String,
        enum: ['free', 'paid', 'subscription'],
        default: 'free',
      },
      price: {
        type: Number,
        default: 0,
        min: [0, '价格不能为负数'],
      },
      subscriptionTiers: {
        type: [SubscriptionTierSchema],
        default: [],
      },
      customRoyalty: {
        type: Number,
        default: 0,
        min: [0, '版税比例不能为负数'],
        max: [50, '版税比例不能超过50%'],
      },
    },
    revenueStats: {
      totalEarned: {
        type: Number,
        default: 0,
        min: [0, '总收入不能为负数'],
      },
      lastPayout: {
        type: Date,
      },
      pendingAmount: {
        type: Number,
        default: 0,
        min: [0, '待支付金额不能为负数'],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create text indexes for search
McpSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Create compound index for category and tags
McpSchema.index({ category: 1, tags: 1 });

// 确保主要所有者在创建时设置为第一个贡献者
McpSchema.pre<IMcp>('save', async function(next) {
  // 如果是新文档且没有贡献者
  if (this.isNew && (!this.contributors || this.contributors.length === 0)) {
    // 将创建者设置为主要所有者，收益分成100%
    this.contributors = [{
      userId: this.owner,
      role: 'owner',
      revenueShare: 100,
      joinedAt: new Date()
    }];
  }

  // 验证所有贡献者的收益分成总和为100%
  if (this.contributors && this.contributors.length > 0) {
    const totalShare = this.contributors.reduce((sum, contributor) => sum + contributor.revenueShare, 0);
    if (Math.abs(totalShare - 100) > 0.01) { // 允许小误差
      return next(new Error('所有贡献者的收益分成总和必须为100%'));
    }
  }

  next();
});

// 当MCP被下载时更新收益统计
McpSchema.methods.recordDownload = async function(amount: number) {
  this.downloads += 1;
  this.revenueStats.totalEarned += amount;
  this.revenueStats.pendingAmount += amount;
  await this.save();
};

// 当支付完成时更新收益统计
McpSchema.methods.recordPayout = async function(amount: number) {
  this.revenueStats.pendingAmount -= amount;
  this.revenueStats.lastPayout = new Date();
  await this.save();
};

// 分配收益给各贡献者
McpSchema.methods.distributeRevenue = async function(amount: number) {
  // 这里仅返回每个贡献者应得的份额，实际的交易处理会在controller中进行
  return this.contributors.map((contributor: IContributor) => ({
    userId: contributor.userId,
    amount: (amount * contributor.revenueShare / 100).toFixed(6),
    share: contributor.revenueShare
  }));
};

const MCP = mongoose.model<IMcp>('MCP', McpSchema);

export default MCP; 