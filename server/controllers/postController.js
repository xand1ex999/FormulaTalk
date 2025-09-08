import Post from "../models/Post.js";
import mongoose from 'mongoose';

class postController {

  async getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
    const posts = await Post.find()
      .sort({ createdAt: -1 })          
      .skip((page - 1) * limit)         
      .limit(limit);                     

    await Post.populate(posts, [
      { path: 'author', select: 'username avatar' },
      { path: 'comments.author', select: 'username avatar' }
    ]);


    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
      res.status(200).json({
        posts,
        page,
        totalPages,
        totalPosts
      });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

  async createPost(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { content, image } = req.body;
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }
      const newPost = await Post.create({
        author: req.user.id,
        content,
        image: image || null
      });
      await newPost.populate([
        { path: 'author', select: 'username avatar' },
        { path: 'comments.author', select: 'username avatar' }
      ]);
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getPost(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'No id provided' });
      }
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      await post.populate([
        { path: 'author', select: 'username avatar' },
        { path: 'comments.author', select: 'username avatar' }
      ]);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async changeContent(req, res) {
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
      await post.populate([
        { path: 'author', select: 'username avatar' },
        { path: 'comments.author', select: 'username avatar' }
      ]);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deletePost(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'No id provided' });
      }
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
      await post.deleteOne();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new postController();
