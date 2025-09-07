import '../pages/Feed/Feed.css';
import { useNavigate } from 'react-router-dom';

const Comment = ({ comment }) => {
  const navigate = useNavigate();

  if (!comment || !comment.author) {
    return null; 
  }

  return (
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
    </div>
  );
};

export default Comment;
