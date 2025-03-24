import express from 'express';
import mcpRoutes from './mcp';
import userRoutes from './user';
import authRoutes from './auth';

const router = express.Router();

// API routes
router.use('/mcps', mcpRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// API version and status
router.get('/', (req, res) => {
  res.json({
    name: 'AIBridge API',
    version: '0.1.0',
    status: 'active',
  });
});

export default router; 