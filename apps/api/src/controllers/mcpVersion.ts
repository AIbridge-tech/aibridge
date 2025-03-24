import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MCP from '../models/mcp';
import McpVersion from '../models/mcpVersion';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

// Helper function to validate version format (semver)
const isValidSemver = (version: string): boolean => {
  const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return semverRegex.test(version);
};

// Get all versions of an MCP
export const getAllVersions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    
    // Validate mcpId
    if (!mongoose.Types.ObjectId.isValid(mcpId)) {
      throw new AppError('Invalid MCP ID', 400);
    }
    
    // Check if MCP exists
    const mcp = await MCP.findById(mcpId);
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Get all versions
    const versions = await McpVersion.find({ mcpId })
      .sort({ createdAt: -1 })
      .select('-implementationCode'); // Exclude implementation code for security
    
    res.status(200).json({
      data: versions,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific version of an MCP
export const getVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId, version } = req.params;
    
    // Validate mcpId
    if (!mongoose.Types.ObjectId.isValid(mcpId)) {
      throw new AppError('Invalid MCP ID', 400);
    }
    
    // Check if MCP exists
    const mcp = await MCP.findById(mcpId);
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Get specific version
    const mcpVersion = await McpVersion.findOne({ 
      mcpId, 
      version
    });
    
    if (!mcpVersion) {
      throw new AppError('Version not found', 404);
    }
    
    res.status(200).json({
      data: mcpVersion,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new version of an MCP
export const createVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId } = req.params;
    const { 
      version, 
      description, 
      changeNotes, 
      apiSchema, 
      implementationCode,
      functions,
      metadata
    } = req.body;
    
    // Validate mcpId
    if (!mongoose.Types.ObjectId.isValid(mcpId)) {
      throw new AppError('Invalid MCP ID', 400);
    }
    
    // Check if MCP exists and user is the owner
    const mcp = await MCP.findById(mcpId);
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check ownership
    if (mcp.owner.toString() !== req.user.id) {
      throw new AppError('You are not authorized to update this MCP', 403);
    }
    
    // Validate version format
    if (!isValidSemver(version)) {
      throw new AppError('Invalid version format. Please use semantic versioning (e.g., 1.0.0)', 400);
    }
    
    // Check if version already exists
    const existingVersion = await McpVersion.findOne({ mcpId, version });
    if (existingVersion) {
      throw new AppError(`Version ${version} already exists for this MCP`, 400);
    }
    
    // Create new version
    const newVersion = await McpVersion.create({
      mcpId,
      version,
      description,
      changeNotes,
      apiSchema,
      implementationCode,
      functions: functions || [],
      metadata: metadata || {},
      createdBy: req.user.id,
    });
    
    // Update MCP's current version
    mcp.version = version;
    await mcp.save();
    
    // Return created version
    res.status(201).json({
      data: newVersion,
    });
  } catch (error) {
    logger.error('Error creating MCP version:', error);
    next(error);
  }
};

// Update a version of an MCP (only if it's the latest)
export const updateVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId, version } = req.params;
    const updateData = req.body;
    
    // Validate mcpId
    if (!mongoose.Types.ObjectId.isValid(mcpId)) {
      throw new AppError('Invalid MCP ID', 400);
    }
    
    // Check if MCP exists and user is the owner
    const mcp = await MCP.findById(mcpId);
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check ownership
    if (mcp.owner.toString() !== req.user.id) {
      throw new AppError('You are not authorized to update this MCP', 403);
    }
    
    // Get version to update
    const mcpVersion = await McpVersion.findOne({ mcpId, version });
    if (!mcpVersion) {
      throw new AppError('Version not found', 404);
    }
    
    // Check if it's the latest version
    if (mcp.version !== version) {
      throw new AppError('Only the latest version can be updated. Create a new version instead.', 400);
    }
    
    // Cannot update version number
    if (updateData.version) {
      delete updateData.version;
    }
    
    // Update version
    const updatedVersion = await McpVersion.findOneAndUpdate(
      { mcpId, version },
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      data: updatedVersion,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a version of an MCP (only if it's not the current version)
export const deleteVersion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mcpId, version } = req.params;
    
    // Validate mcpId
    if (!mongoose.Types.ObjectId.isValid(mcpId)) {
      throw new AppError('Invalid MCP ID', 400);
    }
    
    // Check if MCP exists and user is the owner
    const mcp = await MCP.findById(mcpId);
    if (!mcp) {
      throw new AppError('MCP not found', 404);
    }
    
    // Check ownership
    if (mcp.owner.toString() !== req.user.id) {
      throw new AppError('You are not authorized to delete versions of this MCP', 403);
    }
    
    // Check if it's the current version
    if (mcp.version === version) {
      throw new AppError('Cannot delete the current version of the MCP', 400);
    }
    
    // Delete version
    const deletedVersion = await McpVersion.findOneAndDelete({ mcpId, version });
    if (!deletedVersion) {
      throw new AppError('Version not found', 404);
    }
    
    res.status(200).json({
      data: null,
      message: `Version ${version} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}; 