import Post from "../models/Post.js";
import Report from "../models/Report.js";
import mongoose from 'mongoose';
import updateUserRank from "../utils/updateUserRank.js";
import User from "../models/User.js";

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
      { path: 'author', select: 'username avatar rank' },
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
        res.status(500).json({ message: 'Server error to get all posts' });
      }
  }

    async createPost(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { content } = req.body;
      const files = req.files?.map(f => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`) || [];
    
      const newPost = await Post.create({
        author: req.user.id,
        content,
        files
      });
      await newPost.populate([
        { path: 'author', select: 'username avatar' },
        { path: 'comments.author', select: 'username avatar' }
      ]);
      const user = await User.findById(req.user.id)
      user.points = user.points + 10;
      await updateUserRank(user)
      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error to create a post' });
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
      res.status(500).json({ message: 'Server error to change a content' });
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
      res.status(500).json({ message: 'Server error to delete a post' });
    }
  }

  async createReport(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const { id } = req.params; 
      if (!id) {
        return res.status(400).json({ message: 'No post id provided' });
      }
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const existing = await Report.findOne({
        reportedPost: id,
        reporter: req.user.id
      });
      if (existing) {
        return res.status(400).json({ message: 'You already reported this post' });
      }
      const reported = await Report.create({
        reportedPost: id,
        reporter: req.user.id
      });
      await reported.populate([
        { path: 'reportedPost', select: 'content author createdAt' },
        { path: 'reporter', select: 'username avatar' }
      ]);
      res.status(201).json(reported);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error to report a post' });
    }
  }

  async getAllReports(req, res) {
    try {
      const reports = await Report.find()
        .populate({ path: 'reportedPost', select: 'content author createdAt' })
        .populate({ path: 'reporter', select: 'username avatar' })
        .sort({ createdAt: -1 });

      res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error to get all reports' });
    }
  }

}

export default new postController();
