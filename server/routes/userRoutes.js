import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js'
import leaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();

//user search
router.get("/", userController.searchUsers);

//leaderbord
router.get('/leaderboard', leaderboardController.getLeaders)

//profile related
router.get('/:username', authenticateJWT, userController.getProfile)
router.patch('/:username', authenticateJWT, userController.changeBioOrAvatar);
router.delete('/:username', authenticateJWT, userController.deleteProfile);

//posts related
router.get('/:username/posts', userController.getPublicPosts)

export default router;