import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js'
import leaderboardController from '../controllers/leaderboardController.js';
import fantasyController from '../controllers/fantasyController.js';

const router = express.Router();

//favorites
router.post('/favorite', authenticateJWT, fantasyController.createFavorites)
router.get('/favorite/:username', fantasyController.getFavoriteSelection)

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