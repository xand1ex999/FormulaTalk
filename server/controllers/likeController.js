import Post from "../models/Post.js";
import User from "../models/User.js";
import updateUserRank from "../utils/updateUserRank.js";

class likeController{

  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const user = await User.findById(userId);
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      let action = '';
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
        user.points = user.points - 5;
        action = 'unliked';
      } else {
        post.likes.push(userId);
        user.points = user.points + 5;
        action = 'liked';
      }
      await post.save();
      await updateUserRank(user)
      res.status(200).json({
        message: `Post ${action}`,
        likesCount: post.likes.length,
        likes: post.likes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error with likes' });
    }
  }
}

export default new likeController();