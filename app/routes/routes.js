import express from 'express';
import authRoutes from './authRoutes.js';
import pressRoutes from './pressReleaseRoutes.js';

const router = express.Router();

// **load all routes**
router.use('/auth', authRoutes);
router.use('/press', pressRoutes);

export default router;
