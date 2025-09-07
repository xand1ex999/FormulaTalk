import Post from "../models/Post.js";

class likeController{

  async createComment(req, res){
    try {
      const { id } = req.params;
      const comment = req.body.comment;
      if (!comment) {
        return res.status(400).json({ message: "Comment text is required" });
      }
      const post = await Post.findById(id).populate('comments.author', 'username avatar');
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      post.comments.push({ author: req.user.id, text: comment });
      await post.save();
      await post.populate('comments.author', 'username avatar');
      const newComment = post.comments[post.comments.length - 1];
      res.status(200).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getAllComments(req, res){
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate('comments.author', 'username avatar');
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const comments = post.comments
      res.status(200).json(comments)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async changeComment(req, res){
    try {
      const { postId, commentId } = req.params;
      const updatedComment = req.body.comment;
      const post = await Post.findById(postId)
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if(comment.author.toString() !== req.user.id){
        return res.status(403).json({ message: "Forbidden: not the author" });        
      }
      comment.text = updatedComment;
      await post.save();
      await post.populate('comments.author', 'username avatar');
      res.status(200).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });      
    }
  }

  async deleteComment(req, res){
    try {
      const { postId, commentId } = req.params;
      const post = await Post.findById(postId)
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      if(comment.author.toString() !== req.user.id){
        return res.status(403).json({ message: "You don't have enough roots to delete this comment" });        
      }
      post.comments = post.comments.filter(c => c._id.toString() !== commentId);
      await post.save();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });       
    }
  }
}

export default new likeController();
