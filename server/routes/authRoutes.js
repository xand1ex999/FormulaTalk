import express from 'express';
import User from '../models/User.js';
import authController from '../controllers/authController.js'

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);

export default router;