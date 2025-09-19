import React, { useEffect, useState } from 'react'
import api from '../../api.js';
import '../LeaderBoard/LeaderBoard.css'
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [ leaders, setLeaders ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await api.get('/users/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="leaderboard-layout">
        <div className="leaderboard-loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-layout">
        <div className="leaderboard-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-layout">
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">🏆 Leaderboard</h1>
        
        <div className="leaderboard-header">
          <span className="rank-header">Grid</span>
          <span className="user-header">Driver</span>
          <span className="points-header">Points</span>
        </div>

        <div className="leaderboard-list">
          {leaders.map((user, index) => (
            <div key={user._id} className="leaderboard-item">
              <div className="user-rank">
                <span className="rank-number">{index === 0 ? "Pole" : `P${index + 1}`}</span>
                {index === 0 && <span className="crown">👑</span>}
              </div>
              
              <div className="user-info" onClick={() => navigate(`/profile/${user.username}`)}>
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random` } 
                  alt={user.username}
                  className="user-avatar"
                />
                <div className="user-details">
                  <span className="username">{user.username}</span>
                </div>
                <span className="user-rank-badge">{user.rank}</span>
              </div>
              
              <div className="user-points">
                <span className="points">{user.points}</span>
                <span className="points-label">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Leaderboard);