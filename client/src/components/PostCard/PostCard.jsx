import axios from 'axios';
import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../PostCard/PostCard.css'

const PostCard = ({ post, user, onLike, onOpenComments }) => {
  console.log("Rerender logs:", post._id);
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
          onClick={(e)=>{ e.stopPropagation(); setOpenMenu(prev => !prev) }}>⋯</button>
          {openMenu && (
            <div className='post-menu'>
              <button>Delete Post</button>
              <button onClick={(e)=>{e.stopPropagation(); toast.success("Successfully reported")}}>Report</button>
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
    </div>
  );
};

export default React.memo(PostCard, (prevProps, nextProps) => {
  const samePost = prevProps.post === nextProps.post;
  const sameUser = prevProps.user === nextProps.user;
  const sameOnLike = prevProps.onLike === nextProps.onLike;
  const sameOnOpen = prevProps.onOpenComments === nextProps.onOpenComments;

  console.log("Ccomparison:", {
    post: samePost,
    user: sameUser,
    onLike: sameOnLike,
    onOpenComments: sameOnOpen
  });

  return samePost && sameUser && sameOnLike && sameOnOpen;
});
