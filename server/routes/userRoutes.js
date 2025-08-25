import express from 'express';
import User from '../models/User.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:username', authenticateJWT, async (req, res)=> {
  try {
    const user = await User.findOne({ username: req.params.username });
    if(!user){
      return res.status(404).json({message: 'User not found'})
    }
    if(req.user && req.user.username === req.params.username){
      return res.json(user)
      console.log("Found a token"); 
      console.log(user);
    }
    const { username, bio, createdAt } = user;
    res.json({ username, bio, createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"})
  }
})

// router.put('/:username', async (req, res) => {
//   try {
    
//   } catch (error) {
    
//   }
// });

export default router;