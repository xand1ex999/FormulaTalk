import React, { useState } from 'react';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentModal = ({ post, user, onClose, onLike, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`/api/posts/${post._id}/comments`, { comment: commentText });
      onAddComment(post._id, res.data[res.data.length - 1]); 
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="comment-modal" onClick={onClose}>
      <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          {post.image ? (
            <img src={post.image} alt="Post" className="modal-post-image" />
          ) : <div className="no-image">No image</div>}
        </div>

        <div className="modal-right">
          <div className="modal-header">
            <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=random`} 
                 alt={post.author.username} className="author-avatar" />
            <span className="author-username">{post.author.username}</span>
            <button className="close-modal" onClick={onClose}>×</button>
          </div>

          <div className="modal-post-content">
            <span className="author-username">{post.author.username}</span>
            <span className='author-description'>{post.content}</span>
          </div>

          <div className="modal-comments">
            {post.comments.length > 0 ? post.comments.map((c, idx) => <Comment key={idx} comment={c} />) :
            <p className="no-comments">No comments yet.</p>}
          </div>

          <div className="modal-actions">
            <button className={`like-btn ${post.likes.includes(user?._id) ? 'liked' : ''}`} onClick={() => onLike(post._id)}>❤️</button>
            <span>{post.likes.length} like{post.likes.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="modal-add-comment">
            <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
