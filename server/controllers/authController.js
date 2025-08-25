import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

class authController{

  async registerUser(req, res){
    try {
      const {username, email, password} = req.body;
      if(!username){
      throw new Error('No username provided');
    } else if(!email){
      throw new Error('No email provided');
    } else if(!password){
      throw new Error('No password provided');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const existingUser = await User.findOne({username});
    if(existingUser){
      return res.status(400).json({ message: 'Username already exists' });
    }
    const createdUser = await User.create({username, email, password: hashedPassword })
      res.json(createdUser)
    } catch (error) {
      console.error('Error in registerController:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  async loginUser(req, res){
    const {email, password} = req.body;
    if(!email){
      throw new Error('No email provided')
    } else if (!password){
      throw new Error('No password provided')
    }
    const user = await User.findOne({email})
    if(!user){
      return res.status(401).json({message: 'User Not Found, Please Register First'})
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(401).json({message: 'Invalid credentials'})
    }
    console.log('Login successful!');
    const token = jwt.sign(
      { id: user._id, username: user.username },  
      process.env.JWT_SECRET,                  
      { expiresIn: "12h" }                       
    );

    res.json({ token, user: { username: user.username, email: user.email } });
  }
}

export default new authController();