import React from 'react';

const Comment = ({ comment }) => (
  <div className="modal-comment">
    <img src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`} 
    alt={comment.author.username} className="comment-avatar" />
    <span className="comment-author">{comment.author.username}</span>
    <span className="comment-text">{comment.text}</span>
  </div>
);

export default Comment;
