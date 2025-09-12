import axios from 'axios';
import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../PostCard/PostCard.css'

const PostCard = ({ post, userId, onLike, onOpenComments, onPostDeleted }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  async function handleDelete(e){
    e.stopPropagation();
    console.log("works");
    console.log(userId,"and", post.author._id);
    try {
      const res = await axios.delete(`/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      onPostDeleted(post._id); 
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error", error)
      toast.error('Failed to delete post');
    } 
  }

  async function handleReport(e){
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/posts/reports/${post._id}`, {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      });
      setOpenMenu((prev) => !prev)
      toast.success("Successfully reported")
    } catch (error) {
      console.error("Error", error)
      toast.error('Failed to report post');
    }
  }

  return (
    <div className="post-card" onClick={() => onOpenComments(post)}>
      <div className="post-header">
        <div className="post-author" onClick={() => navigate(`/profile/${post.author.username}`)}>
          <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=random`} 
               alt={post.author.username} className="author-avatar" />
          <div className="author-info">
            <span className="author-username">{post.author.username}</span>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {userId === post.author._id && (
          <div className="relative">
            <button
              className="post-more"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((prev) => !prev);
              }}
            >
              ⋯
            </button>

            {openMenu && (
              <div
                className="post-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={handleDelete}>🗑 Delete Post</button>
                <button onClick={handleReport}>🚩 Report</button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.files && post.files.length > 0 && (
        <div className="post-image-container">
          <img src={post.files[0]} alt="Post image" className="post-image" />
        </div>
      )}

      <div className="post-actions">
        <button className={`like-btn ${post.likes.includes(userId) ? 'liked' : ''}`} onClick={(e) => {e.stopPropagation(); onLike(post._id)}}>❤️</button>
        <button className="comment-btn">💬</button>
      </div>

      {post.likes.length > 0 && (
        <div className="post-likes">{post.likes.length} like{post.likes.length !== 1 ? 's' : ''}</div>
      )}

      <div className="post-content">
        <span className="author-username">{post.author.username}</span>
        <span className="post-text">{post.content}</span>
      </div>
      {post.comments.length > 0 && (
        <div className="post-comments-preview">
          View {post.comments.length === 1 ? '1 comment' : `all ${post.comments.length} comments`}
        </div>
      )}
    </div>
  );
};

export default React.memo(PostCard, (prevProps, nextProps) => {
  return prevProps.post === nextProps.post && prevProps.userId === nextProps.userId;
});

//☝
// React automatically provides prevProps (last render) and nextProps (current render).
// If this function returns true → props are "equal" → component skips re-render.
// If false → component re-renders.
// Here I compare only `post` and `userId` to prevent unnecessary renders when other props change.
