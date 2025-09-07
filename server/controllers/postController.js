import Post from "../models/Post.js";
import mongoose from 'mongoose';

class postController{

  async getAllPosts(req, res){
    try {
      const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');
      if(posts.length === 0){
        return res.status(200).json({ message: 'There are no posts so far' });
      }
      res.status(201).json(posts)
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server error'})
    }
  }

  async createPost(req, res){
    try {
      if(!req.user){
        return res.status(401).json({message: 'Unauthorized'})
      }
        const { content, image } = req.body;
      if(!content){
        return res.status(400).json({message: 'Content is required'});
      }
      const newPost = await Post.create({author: req.user.id, content, image: image || null})
      const populatedPost = await newPost
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');
      res.status(201).json(populatedPost);
    } catch (error) {
      console.error(error)
      res.status(500).json({message: 'Server error'})
    }
  }

  async getPost(req, res){
    try {
      const { id } = req.params;
      if(!id){
        return res.status(401).json({message: 'No id provided'})
      }
      const post = await Post.findById(id)
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');
      res.status(200).json(post)
    } catch (error) {
      console.error(error)
      res.status(500).json({message: error})
    }
  }

  async changeContent(req, res){
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
        const { id } = req.params;
        const { content, image } = req.body; 
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post id' });
      }
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (content) post.content = content;
      if (image) post.image = image;
        await post.save();
      const updatedPost = await post
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar');
      res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  }

  async deletePost(req, res){
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = req.params;
      if(!id){
        return res.status(401).json({message: 'No id provided'})
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid post id' });
      }
      const post = await Post.findById(id);
      if(!post){
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      await post.deleteOne();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new postController();