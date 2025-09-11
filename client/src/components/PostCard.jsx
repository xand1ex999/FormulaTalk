import React from 'react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, user, onLike, onOpenComments }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
        <button className="post-more">⋯</button>
      </div>

      {post.files && post.files.length > 0 && (
        <div className="post-image-container">
          <img src={post.files[0]} alt="Post image" className="post-image" />
        </div>
      )}

      <div className="post-actions">
        <button className={`like-btn ${post.likes.includes(user?._id) ? 'liked' : ''}`} onClick={(e) => {e.stopPropagation(); onLike(post._id)}}>❤️</button>
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

export default PostCard;
