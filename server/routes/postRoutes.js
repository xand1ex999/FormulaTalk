import express from 'express';
const router = express.Router();
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import postController from '../controllers/postController.js';

router.get('/posts', postController.getAllPosts);
router.post('/posts', authenticateJWT, postController.createPost);
router.get('/posts/:id', postController.getPost);
router.patch('/posts/:id', authenticateJWT, postController.changeContent);
router.delete('/posts/:id', authenticateJWT, postController.deletePost);

export default router;