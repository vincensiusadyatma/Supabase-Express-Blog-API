import express from 'express';
import {loginWithGoogle, authenticateUser, logoutUser} from '../controllers/authController.js';

const router = express.Router();


router.get('/google', loginWithGoogle); 
router.get('/authenticate', authenticateUser); 
router.post('/logout', logoutUser); 

export default router;
