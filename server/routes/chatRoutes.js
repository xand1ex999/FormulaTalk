import express from 'express';
import chatController from '../controllers/chatController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/chats', authenticateJWT, chatController.createChat); 
router.get('/chats', authenticateJWT, chatController.getAllChats); 

export default router;