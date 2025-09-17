import { sendLoginMail, sendRegisterMail } from '../utils/mailer.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


class authController{

  async registerUser(req, res){
    try {
      const { username, email, password } = req.body;
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
    const createdUser = await User.create({ username, email, password: hashedPassword });
    const user = createdUser.toObject();
    delete user.password;
    const token = jwt.sign(
      { id: user._id, username: user.username },  
      process.env.JWT_SECRET,                  
      { expiresIn: "24h" }                       
    );
    sendRegisterMail(user, req).catch(console.error);
    console.log("Successfully registered");
    res.json({ token, user });
    } catch (error) {
      console.error('Error in registerController:', error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  async loginUser(req, res){
    try {
      const { email, password } = req.body;
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
        const token = jwt.sign(
          { id: user._id, username: user.username },  
          process.env.JWT_SECRET,                  
          { expiresIn: "24h" }                       
        );
        sendLoginMail(user, req).catch(console.error);
        console.log('Login successful!');
        res.json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed" });
    }
  }
}

export default new authController();