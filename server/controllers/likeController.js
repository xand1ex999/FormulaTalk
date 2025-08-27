import Post from "../models/Post.js";


class likeController{

  async likePost(req, res){
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await Post.findById(id);
      if(!post){
        return res.status(401).json({message: 'Post not found'})
      }
      if (post.likes.includes(req.user.id)) {
        return res.status(400).json({ message: 'You already liked this post' });
      }
      post.likes.push(userId);
      await post.save();
      res.status(200).json({message: 'Post liked', likesCount: post.likes.length, likes: post.likes});
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Server error'})
    }
  }

  async unlikePost(req, res){
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await Post.findById(id);
      if(!post){
        return res.status(401).json({message: 'Post not found'})
      }
      if (!post.likes.includes(userId)) {
        return res.status(400).json({ message: 'You have not liked this post yet' });
      }
      post.likes = post.likes.filter(likeId => likeId.toString() !== userId);
      await post.save();
      res.status(200).json({message: 'Post unliked', likesCount: post.likes.length, likes: post.likes});
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Server error'})
    }
  }
}

export default new likeController();