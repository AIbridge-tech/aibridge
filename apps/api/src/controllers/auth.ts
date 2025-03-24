import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
import User from '../models/user';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import crypto from 'crypto';

// JWT token helpers
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  
  // Calculate token expiry for refresh token
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const expiryDate = new Date();
  
  if (expiresIn.endsWith('d')) {
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiresIn));
  } else if (expiresIn.endsWith('h')) {
    expiryDate.setHours(expiryDate.getHours() + parseInt(expiresIn));
  } else if (expiresIn.endsWith('m')) {
    expiryDate.setMinutes(expiryDate.getMinutes() + parseInt(expiresIn));
  }
  
  // Set secure cookie with the token
  res.cookie('jwt', token, {
    expires: expiryDate,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    data: {
      user,
      token,
      expiresIn,
    },
  });
};

// Register new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
    });
    
    // Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });
    
    // TODO: Send verification email with token
    // Not implementing actual email sending here, just logging
    logger.info(`Verification token for ${email}: ${verificationToken}`);
    
    // Send token to client
    createSendToken(newUser, 201, res);
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password are provided
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }
    
    // Find user and include password field (which is excluded by default)
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Incorrect email or password', 401);
    }
    
    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// Logout user
export const logout = (req: Request, res: Response) => {
  // Clear JWT cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  
  res.status(200).json({ data: null, message: 'Logged out successfully' });
};

// Verify email
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    
    // Hash the token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with this token and check if token is still valid
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }
    
    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError('No user found with that email', 404);
    }
    
    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // TODO: Send password reset email with token
    // Not implementing actual email sending here, just logging
    logger.info(`Reset token for ${email}: ${resetToken}`);
    
    res.status(200).json({
      data: null,
      message: 'Token sent to email',
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Hash the token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with this token and check if token is still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }
    
    // Update user's password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Update password
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Your current password is incorrect', 401);
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User is already added to req by protect middleware
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }
    
    res.status(200).json({
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}; 