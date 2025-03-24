import { Request, Response, NextFunction } from 'express';
import MCP from '../models/mcp';
import User from '../models/user';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

// Get all MCPs with filtering and pagination
export const getAllMcps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      tags,
      sort = 'newest',
    } = req.query;
    
    // Build query
    const query: any = { isPublic: true };
    
    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add tags filter
    if (tags) {
      query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    }
    
    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    
    // Determine sort order
    let sortOrder = {};
    switch (sort) {
      case 'popular':
        sortOrder = { downloads: -1 };
        break;
      case 'rating':
        sortOrder = { averageRating: -1 };
        break;
      case 'newest':
      default:
        sortOrder = { createdAt: -1 };
    }
    
    // Fetch MCPs with pagination
    const mcps = await MCP.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum)
      .populate('owner', 'name avatarUrl');
    
    // Count total documents for pagination
    const total = await MCP.countDocuments(query);
    
    res.status(200).json({
      data: {
        mcps,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get MCP by ID
export const getMcpById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const mcp = await MCP.findById(id).populate('owner', 'name avatarUrl');
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check if MCP is private and user is not the owner or admin
    if (!mcp.isPublic && (!req.user || (req.user.id !== mcp.owner.id && req.user.role !== 'admin'))) {
      throw new AppError('Not authorized to access this MCP', 403);
    }
    
    res.status(200).json({
      data: mcp,
    });
  } catch (error) {
    next(error);
  }
};

// Search MCPs
export const searchMcps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      throw new AppError('Search query is required', 400);
    }
    
    const mcps = await MCP.find({
      isPublic: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('owner', 'name avatarUrl');
    
    res.status(200).json({
      data: mcps,
    });
  } catch (error) {
    next(error);
  }
};

// Create MCP
export const createMcp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      version,
      category,
      tags,
      functions,
      metadata,
      isPublic = true,
    } = req.body;
    
    // Create MCP
    const mcp = await MCP.create({
      name,
      description,
      version,
      category,
      tags,
      functions,
      metadata,
      isPublic,
      owner: req.user.id,
    });
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.mcpsCreated': 1 },
    });
    
    res.status(201).json({
      data: mcp,
    });
  } catch (error) {
    logger.error('Create MCP error:', error);
    next(error);
  }
};

// Update MCP
export const updateMcp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find MCP
    const mcp = await MCP.findById(id);
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check if user is authorized to update this MCP
    if (mcp.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this MCP', 403);
    }
    
    // Update MCP
    const updatedMcp = await MCP.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name avatarUrl');
    
    res.status(200).json({
      data: updatedMcp,
    });
  } catch (error) {
    logger.error('Update MCP error:', error);
    next(error);
  }
};

// Delete MCP
export const deleteMcp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Find MCP
    const mcp = await MCP.findById(id);
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check if user is authorized to delete this MCP
    if (mcp.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this MCP', 403);
    }
    
    // Delete MCP
    await MCP.findByIdAndDelete(id);
    
    // Update user stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.mcpsCreated': -1 },
    });
    
    res.status(200).json({
      data: null,
      message: 'MCP deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Rate MCP
export const rateMcp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rating, comment = '' } = req.body;
    
    // Find MCP
    const mcp = await MCP.findById(id);
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check if user has already rated this MCP
    const existingRatingIndex = mcp.ratings.findIndex(
      r => r.userId.toString() === req.user.id
    );
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      mcp.ratings[existingRatingIndex].value = rating;
      mcp.ratings[existingRatingIndex].comment = comment;
    } else {
      // Add new rating
      mcp.ratings.push({
        userId: req.user.id,
        userName: req.user.name,
        value: rating,
        comment,
        createdAt: new Date().toISOString(),
      });
    }
    
    // Calculate average rating
    if (mcp.ratings.length > 0) {
      const sum = mcp.ratings.reduce((acc, r) => acc + r.value, 0);
      mcp.averageRating = parseFloat((sum / mcp.ratings.length).toFixed(1));
    }
    
    // Save MCP
    await mcp.save();
    
    res.status(200).json({
      data: mcp,
    });
  } catch (error) {
    next(error);
  }
};

// Download MCP
export const downloadMcp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Find and update MCP
    const mcp = await MCP.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Update owner's download stats
    await User.findByIdAndUpdate(mcp.owner, {
      $inc: { 'stats.totalDownloads': 1 },
    });
    
    res.status(200).json({
      data: {
        downloadUrl: `${req.protocol}://${req.get('host')}/api/mcps/${id}/download/file`,
        mcp,
      },
    });
  } catch (error) {
    next(error);
  }
}; 