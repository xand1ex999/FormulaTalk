import Post from "../models/Post.js";


class likeController{

  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      let action = '';
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
        action = 'unliked';
      } else {
        post.likes.push(userId);
        action = 'liked';
      }
      await post.save();
      res.status(200).json({
        message: `Post ${action}`,
        likesCount: post.likes.length,
        likes: post.likes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new likeController();