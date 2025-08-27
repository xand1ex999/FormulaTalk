import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js'

const router = express.Router();

//profile related
router.get('/:username', authenticateJWT, userController.getProfile)
router.patch('/:username', authenticateJWT, userController.changeBioOrAvatar);
router.delete('/:username', authenticateJWT, userController.deleteProfile);

//posts related
router.get('/:username/posts', userController.getPublicPosts)

export default router;