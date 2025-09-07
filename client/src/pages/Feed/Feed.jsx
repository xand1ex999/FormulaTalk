import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import './Feed.css'
import { useNavigate } from 'react-router-dom'

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    async function fetchAllPosts() {
      try {
        setLoading(true);
        const res = await axios.get('/api/posts');
        setPosts(res.data);
      } catch (error) {
        console.error("Error loading posts:", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    }
    fetchAllPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/toggleLike`);
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: res.data.likes } : post
      ));
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentTexts(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleComment = async (postId) => {
    try {
      const text = commentTexts[postId] || "";
      if (!text.trim()) return;
      const res = await axios.post(`/api/posts/${postId}/comments`, { comment: text });
      setCommentTexts(prev => ({
        ...prev,
        [postId]: ""
      }));

      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="feed-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="feed-container">
        <div className="feed">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {/* AUTHOR */}
              <div className="post-header">
                <div className="post-author" onClick={() => {navigate(`/profile/${post.author.username}`)}}>
                  <img 
                    src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=random`} 
                    alt={post.author.username}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <span className="author-username">{post.author.username}</span>
                    <span className="post-time">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <button className="post-more">⋯</button>
              </div>

              {/* POST IMAGE */}
              {post.image && (
                <div className="post-image-container">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="post-image"
                  />
                </div>
              )}

              {/* Actions - likes, comments */}
              <div className="post-actions">
                <button 
                  className={`like-btn ${post.likes.includes(user?._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  ❤️
                </button>
                <button className="comment-btn">💬</button>
                <button className="share-btn">📤</button>
                <button className="save-btn">🔖</button>
              </div>

              {/* information about likes */}
              <div className="post-likes">
                {post.likes.length > 0 && (
                  <span>{post.likes.length} like{post.likes.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {/* Post content - description */}
              <div className="post-content">
                <span className="author-username">{post.author.username}</span>
                <span className="post-text">{post.content}</span>
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  {post.comments.slice(0, 2).map((comment, index) => (
                    <div key={index} className="comment">
                      <span className="comment-author">{comment.author.username}</span>
                      <span className="comment-text">{comment.text}</span>
                    </div>
                  ))}
                  {post.comments.length > 2 && (
                    <button className="view-comments-btn">
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              )}

              {/* Add comment */}
              <div className="add-comment">
                <input 
                  type="text" 
                  placeholder="Add a comment..."
                  value={commentTexts[post._id] || ""}  // индивидуальный input
                  onChange={(e) => handleInputChange(post._id, e.target.value)}
                  className="comment-input"
                />
                <button 
                  className="post-comment-btn" 
                  onClick={() => handleComment(post._id)}
                >
                  Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

export default Feed;