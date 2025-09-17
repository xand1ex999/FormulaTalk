import { useNavigate, useParams } from 'react-router-dom';
import '../Comment/Comment.css'
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Comment = ({ comment, handleDeleteComment, handleChangeComment }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ openOptions, setOpenOptions ] = useState(false);
  const isAuthor = user?.username === comment.author.username;
  const [ isEditing, setIsEditing ] = useState(false);
  const [ editText, setEditText ] = useState(comment.text);

  if (!comment || !comment.author) {
    return null; 
  }

  function handleOptions(e){
    e.stopPropagation();
    setOpenOptions(prev => !prev);
  }

  async function handleApplyChange() {
    if (!editText.trim()) return;
    try {
      await handleChangeComment(comment._id, editText); 
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  }

  return (
    <>
    <div className="comment" onClick={() => {navigate(`/profile/${comment.author.username}`)}}>
      <img
        src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
        alt={comment.author.username}
        className="comment-avatar"
      />
      <div className="comment-content">
        <span className="comment-author">{comment.author.username}</span>
        
        {isEditing ? (
          <div className="comment-edit">
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); handleApplyChange()} }>Apply</button>
            <button onClick={(e) =>{ e.stopPropagation(); setIsEditing(false)} }>Cancel</button>
          </div>
        ) : (
          <span className="comment-text" onClick={e => e.stopPropagation()}>
            {comment.text}
          </span>
        )}
      </div>

      {isAuthor && (
        <div title='More options' className='comment-actions' onClick={handleOptions}>...</div>
      )}
    </div>

    {openOptions && isAuthor && !isEditing && (
      <div className="comment-options">
        <button onClick={() => { setIsEditing(true); setOpenOptions(false) }}>Change comment</button>
        <button onClick={() => { handleDeleteComment(comment._id) }}>Delete comment</button>
      </div>
    )}
    </>
  );
};

export default Comment;
