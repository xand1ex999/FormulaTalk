import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import postController from '../controllers/postController.js';
import likeController from '../controllers/likeController.js';
import commentController from '../controllers/commentController.js';
import multer from 'multer';
import sharp from "sharp";
import fs from 'fs';

const upload = multer({ dest: 'tmp/' });

const router = express.Router();

//reports
router.get('/posts/reports/', postController.getAllReports);
router.post('/posts/reports/:id', authenticateJWT, postController.createReport);

//posts
router.get('/posts', postController.getAllPosts);
router.post('/posts', authenticateJWT, upload.array('files', 10), postController.createPost);
router.get('/posts/:id', postController.getPost);
router.patch('/posts/:id', authenticateJWT, postController.changeContent);
router.delete('/posts/:id', authenticateJWT, postController.deletePost);

//likes
router.post('/posts/:id/toggleLike', authenticateJWT, likeController.toggleLike)

//comments
router.post('/posts/:id/comments', authenticateJWT, commentController.createComment);
router.get('/posts/:id/comments', commentController.getAllComments);
router.patch('/posts/:postId/comments/:commentId', authenticateJWT, commentController.changeComment);
router.delete('/posts/:postId/comments/:commentId', authenticateJWT, commentController.deleteComment);

export default router;