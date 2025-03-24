import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import validator from 'validator';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin' | 'creator';
  status: 'active' | 'inactive' | 'suspended';
  profilePicture?: string;
  website?: string;
  github?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
  walletAddress?: string;
  aibBalance: number;
  revenueHistory: Array<{
    amount: number;
    currency: string;
    source: string;
    mcpId: mongoose.Types.ObjectId;
    timestamp: Date;
  }>;
  paymentSettings: {
    preferredCurrency: string;
    autoWithdraw: boolean;
    withdrawThreshold: number;
  };
  totalRevenue: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createPasswordResetToken(): string;
  createEmailVerificationToken(): string;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatarUrl: {
      type: String,
      default: function() {
        const hash = crypto
          .createHash('md5')
          .update(this.email)
          .digest('hex');
        return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
      },
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be longer than 500 characters'],
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'creator'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    lastLoginAt: {
      type: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    walletAddress: {
      type: String,
      validate: {
        validator: function(value: string) {
          // Solana wallet address validation (base58 encoded, 44 characters)
          return !value || /^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(value);
        },
        message: 'Invalid wallet address format'
      }
    },
    aibBalance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    revenueHistory: [
      {
        amount: {
          type: Number,
          required: [true, 'Amount is required']
        },
        currency: {
          type: String,
          required: [true, 'Currency is required'],
          default: 'AIB'
        },
        source: {
          type: String,
          required: [true, 'Source is required'],
          enum: ['download', 'usage', 'reward', 'referral', 'subscription']
        },
        mcpId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MCP',
          required: [true, 'Related MCP is required']
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    paymentSettings: {
      preferredCurrency: {
        type: String,
        enum: ['AIB', 'SOL', 'USD'],
        default: 'AIB'
      },
      autoWithdraw: {
        type: Boolean,
        default: false
      },
      withdrawThreshold: {
        type: Number,
        default: 100,
        min: [10, 'Withdrawal threshold cannot be lower than 10']
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create index for email to improve query performance
UserSchema.index({ email: 1 });

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt with cost factor 12
    const salt = await bcrypt.genSalt(12);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update passwordChangedAt property when password changes
UserSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  try {
    // Use bcrypt to compare the candidate password with the stored hash
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Create password reset token
UserSchema.methods.createPasswordResetToken = function(): string {
  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and store it in the user document
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set the token expiration (10 minutes)
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  
  return resetToken;
};

// Create email verification token
UserSchema.methods.createEmailVerificationToken = function(): string {
  // Generate a random token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and store it in the user document
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  // Set the token expiration (24 hours)
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return verificationToken;
};

// Method to check if password is correct
UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if user changed password after the JWT was issued
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Virtual property: total revenue
UserSchema.virtual('totalRevenue').get(function() {
  if (!this.revenueHistory || this.revenueHistory.length === 0) {
    return 0;
  }

  return this.revenueHistory.reduce((sum, item) => sum + item.amount, 0);
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User; 