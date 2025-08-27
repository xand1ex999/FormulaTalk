import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import postController from '../controllers/postController.js';
import likeController from '../controllers/likeController.js';

const router = express.Router();

router.get('/posts', postController.getAllPosts);
router.post('/posts', authenticateJWT, postController.createPost);
router.get('/posts/:id', postController.getPost);
router.patch('/posts/:id', authenticateJWT, postController.changeContent);
router.delete('/posts/:id', authenticateJWT, postController.deletePost);

//likes
router.post('/posts/:id/toggleLike', authenticateJWT, likeController.toggleLike)

//comments

export default router;