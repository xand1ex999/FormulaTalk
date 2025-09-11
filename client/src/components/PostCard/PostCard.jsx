import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import '../PostCard/PostCard.css'

const PostCard = ({ post, user, onLike, onOpenComments }) => {
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);


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
    console.log(user.id,"and", post.author._id);
    try {
      const res = await axios.delete(`/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error", error)
      toast.error('Failed to delete post');
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
        {user.id === post.author._id && (
          <>
          <button 
          className="post-more" 
          onClick={(e)=>{ e.stopPropagation(); setOpenDeleteModal(true) }}>⋯</button>
          {openDeleteModal && (
            <div>
              <button>Delete Post</button>
            </div>
          )}
          </>
        )}
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
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} theme="dark"/>
    </div>
  );
};

export default PostCard;
