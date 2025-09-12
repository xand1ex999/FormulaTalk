import { useNavigate, useParams } from 'react-router-dom';
import '../Comment/Comment.css'
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Comment = ({ comment, handleDeleteComment }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(comment._id);
  
  
  const [openOptions, setOpenOptions] = useState(false);
  const isAuthor = user?.username === comment.author.username;

  if (!comment || !comment.author) {
    return null; 
  }

  function handleOptions(e){
    e.stopPropagation();
    setOpenOptions(prev => !prev);
  }


  return (
    <>
    <div className="comment" onClick={()=>{navigate(`/profile/${comment.author.username}`)}}>
      <img
        src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
        alt={comment.author.username}
        className="comment-avatar"
      />
      <div className="comment-content">
        <span className="comment-author">{comment.author.username}</span>
        <span className="comment-text">{comment.text}</span>
      </div>
      <div title='More options' className='comment-actions' onClick={handleOptions}>...</div>
    </div>
    {openOptions && (
      <div className="comment-options">
        {user.username === comment.author.username ? (
          <>
            <button>Change comment</button>
            <button onClick={()=>{handleDeleteComment(comment._id)}}>Delete comment</button>
          </>
        ) : (
          <button>Report</button>
        )}
      </div>
    )}
    </>
  );
};

export default Comment;
