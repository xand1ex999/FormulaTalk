import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from '../Comment/Comment.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../CommentModal/CommentModal.css'

const CommentModal = ({ post, userId, onClose, onLike, onAddComment, handleDeleteComment, handleChangeComment }) => {
  const navigate = useNavigate();
  const [ commentText, setCommentText ] = useState('');
  const [ currentPhoto, setCurrentPhoto ] = useState(0);  
  
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`/api/posts/${post._id}/comments`, { comment: commentText });
      onAddComment(post._id, res.data);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment');
    }
  };

  const nextPhoto = () => {
    if (currentPhoto < post.files.length - 1) {
      setCurrentPhoto((prev) => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhoto > 0) {
      setCurrentPhoto((prev) => prev - 1);
    }
  };

  return (
    <div className="comment-modal" onClick={onClose}>
      <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-left">
          {post.files && post.files.length > 0 ? (
            <>
              <button
                className={`left-arrow-files ${currentPhoto === 0 ? 'hidden' : 'active'}`}
                onClick={prevPhoto}
              >
                ⬅
              </button>

              <img
                src={post.files[currentPhoto]}
                alt="Post"
                className="modal-post-image"
              />

              <button
                className={`right-arrow-files ${currentPhoto === post.files.length - 1 ? 'hidden' : 'active'}`}
                onClick={nextPhoto}
              >
                ➡
              </button>
            </>
          ) : (
            <div className="no-image">No image</div>
          )}
        </div>

        <div className="modal-right">
          <div className="modal-header">
            <img src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=random`} 
                 alt={post.author.username} className="author-avatar" onClick={() => {navigate(`/profile/${post.author.username}`)}} />
            <span className="author-username">{post.author.username}</span>
            <button className="close-modal" onClick={onClose}>×</button>
          </div>

          <div className="modal-post-content">
            <span className="author-username">{post.author.username}</span>
            <span className='author-description'>{post.content}</span>
          </div>

          <div className="modal-comments">
            {post.comments.length > 0 
            ? post.comments.map((c, idx) => 
            <Comment 
            key={c._id} 
            comment={c} 
            handleDeleteComment={(commentId) => handleDeleteComment(post._id, commentId)}  
            handleChangeComment={(commentId, newText) => handleChangeComment(post._id, commentId, newText)}
            />) 
            
            :<p className="no-comments">No comments yet.</p>}
          </div>

          <div className="modal-actions">
            <button title='Like' className={`like-btn ${post.likes.includes(userId) ? 'liked' : ''}`} onClick={() => onLike(post._id)}>🏎️</button>
            <span>{post.likes.length} pit stop{post.likes.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="modal-add-comment">
            <input 
            type="text" 
            placeholder="Add a radio message..." 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)} 
            onKeyDown={e => {
              if(e.key === "Enter"){
                  e.preventDefault();
                  handleAddComment()
                }
              }} />
            <button onClick={handleAddComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommentModal);