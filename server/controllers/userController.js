import Post from "../models/Post.js";
import User from "../models/User.js";

class userController{

  //user search
  async searchUsers(req, res){
    try {
      const { search } = req.query;
      if (!search) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const users = await User.find({
        username: { $regex: search.trim(), $options: "i" } //regex = (contains) analog
      }).select("username avatar");   
    res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //profile related
  async getProfile(req, res){
    try {
      const user = await User.findOne({ username: req.params.username }).select("-password ").select("username bio createdAt avatar rank points favoriteDriver favoriteTeam");
      console.log(user);
      
      if(!user){
        return res.status(404).json({message: 'User not found'})
      }
      if(req.user && req.user.username === req.params.username){
        return res.json(user)
      }
      const { username, bio, createdAt, avatar, rank, points, favoriteDriver, favoriteTeam } = user;
      res.json({ username, bio, createdAt, avatar, rank, points, favoriteDriver, favoriteTeam });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server error"})
    }
  }

  async changeBioOrAvatar(req, res) {
    try {
      if (!req.user || req.user.username !== req.params.username) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const updates = {};
      if(req.body.bio) updates.bio = req.body.bio;
      if(req.body.avatar) updates.avatar = req.body.avatar;
      const updatedUser = await User.findOneAndUpdate(
        { username: req.params.username },   
        updates,                            
        { new: true }                        
      ).select("-password");
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async deleteProfile(req, res) {
    try {
      if (!req.user || req.user.username !== req.params.username) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const deletedUser = await User.findOneAndDelete({username: req.params.username})
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  }

  //posts related

  async getPublicPosts(req, res){
    try {
      const { username } = req.params;
      if(!username){
        return res.status(401).json({message: 'User not found'});
      }
      const user = await User.findOne({username});
      if(!user){
        return res.status(401).json({message: 'User not found'});
      }
      const posts = await Post.find({author: user.id})
      .populate('author', 'username avatar')
      .sort({createdAt: -1}); // -1 desc, 1 asc
      res.json(posts)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new userController();