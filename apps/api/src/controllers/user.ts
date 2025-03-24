import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import MCP from '../models/mcp';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

// Get user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get user MCPs
export const getUserMcps = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Check if user is requesting their own MCPs or is an admin
    const isOwnerOrAdmin = 
      req.user.id === userId || req.user.role === 'admin';
    
    // Build query based on user role and ownership
    const query: any = { owner: userId };
    
    // Only include public MCPs if not owner or admin
    if (!isOwnerOrAdmin) {
      query.isPublic = true;
    }
    
    const mcps = await MCP.find(query).sort('-createdAt');
    
    res.status(200).json({
      data: mcps,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Prevent updating restricted fields
    const allowedUpdates = ['name', 'bio', 'avatarUrl'];
    const updateData: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin only)
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      data: {
        users,
        count: users.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID (admin only)
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user by ID (admin only)
export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating restricted fields
    const allowedUpdates = ['name', 'email', 'role', 'isEmailVerified'];
    const updateData: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Delete all MCPs owned by the user
    await MCP.deleteMany({ owner: id });
    
    res.status(200).json({
      data: null,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}; 