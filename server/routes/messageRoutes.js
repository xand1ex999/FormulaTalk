import express from 'express';
import messageController from '../controllers/messageController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/messages/:chatId', authenticateJWT, messageController.loadChat); 
router.post('/messages/:chatId', authenticateJWT, messageController.sendMessage); 

export default router;