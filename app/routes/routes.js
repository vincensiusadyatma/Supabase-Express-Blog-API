import express from 'express';
import authRoutes from './authRoutes.js';
import pressRoutes from './pressReleaseRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import carrerRoutes from './careerRoutes.js';

const router = express.Router();

// **load all routes**
router.use('/auth', authRoutes);
router.use('/press', pressRoutes);
router.use('/gallery', galleryRoutes);
router.use('/career', carrerRoutes);

export default router;
