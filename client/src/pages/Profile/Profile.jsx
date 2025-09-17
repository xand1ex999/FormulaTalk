import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Profile.css' 
import CommentModal from '../../components/CommentModal/CommentModal.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user } = useAuth();
  const [ profileData, setProfileData ] = useState(null);
  const [ profilePosts, setProfilePosts ] = useState([]);
  const [ paddockData, setPaddockData ] = useState({});
  const [ paddockOpen, setPaddockOpen ] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
  const [ editForm, setEditForm ] = useState({
    bio: '',
    avatar: ''
  });
  const [ submitting, setSubmitting ] = useState(false);
  const [ activeTab, setActiveTab ] = useState('information');

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/users/${username}`);
        setProfileData(res.data);
        setEditForm({
          bio: res.data.bio || '',
          avatar: res.data.avatar || ''
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  useEffect(()=>{
    if(!profileData){
      return;
    }
    async function fetchProfilePosts(){
      try {
        const res = await axios.get(`/api/users/${username}/posts`);
        setProfilePosts(res.data)
      } catch (error) {
        console.error("Error loading profile posts:", error);
      }
    }
    if(activeTab === 'posts'){
      fetchProfilePosts();
    } 
  },[activeTab, username]);

  useEffect(()=>{
    if(!profileData){
      return;
    }
    async function fetchPaddock(){
      try {
        const res = await axios.get(`/api/users/favorite/${username}`);
        setPaddockData(res.data)
        setPaddockOpen(true)
      } catch (error) {
        console.error("Error loading profile posts:", error);
      }
    }
    if(activeTab === 'paddock'){
      fetchPaddock();
    } 
  },[activeTab]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.patch(`/api/users/${username}`, {
        bio: editForm.bio,
        avatar: editForm.avatar
      });
      setProfileData(res.data);
      closeEditModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };
  
  async function handleCreateChat(){
    try {
      const res = await axios.post(`/api/chats`, {
        receiverId: profileData.id
      })
      navigate('/chat')
    } catch (error) {
      console.log("Error creating a chat", error)
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="error">Profile not found</div>
      </div>
    );
  }

  const isOwner = user?.username === username;
  const joinDate = new Date(profileData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
 
  return (
    <>
    <div className="profile-container">
      {/* Modal window to change bio and avatar */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="avatar">Avatar URL:</label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={editForm.avatar}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="save-btn-modal"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main profile content */}
      <div className="profile-header">
        <div className="profile-avatar">
          {profileData.avatar ? (
            <img src={profileData.avatar} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {profileData.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{profileData.username} <p className="user-profile-rank-badge">{profileData.rank}</p> </h1>
          <p className="profile-join-date">Joined {joinDate}</p>
        </div>
        {user.id !== profileData._id 
        ? (<div className='create-chat-button'>
            <button onClick={() => {handleCreateChat()}}>Go to the chat</button>
          </div>)
        : ('')}
      </div>

      <div className='profile-nav'>
        <button onClick={() => {setActiveTab('information')}}>Information</button>
        <button onClick={() => {setActiveTab('posts')}}>Posts</button>
        <button onClick={() => {setActiveTab('paddock')}}>Paddock Choices</button>
      </div>

      {/* Information profile content */}
      {activeTab === 'information' && (
        <>
        <div className="detail-card">
          <h3>About</h3>
          <div className="detail-item">
            <span className="detail-label">Bio:</span>
            <span className="detail-value">
              {profileData.bio || "No bio yet"}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-card">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                {isOwner ? profileData.email : "Hidden"}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="profile-actions">
            <button className="edit-btn" onClick={openEditModal}>
              Edit Profile
            </button>
          </div>
        )}
        </>
      )}

      {/* Posts profile content */}
      {activeTab === 'posts' && (
        <div className="posts-section">
          <h2>{profileData.username}'s Posts</h2>
          {profilePosts && profilePosts.length > 0 ? (
            <div className="posts-grid">
              {profilePosts.map((post) => (
                <div 
                  key={post._id} 
                  className="post-item"
                  onClick={() => setSelectedPost(post)}
                >
                  {post.files && post.files.length > 0 ? (
                    <img src={post.files[0]} alt="Post preview" />
                  ) : (
                    <div className="no-image"><p>There is a text post</p></div>
                  )}

                  <div className="overlay">
                    <span>🏎️ {post.likes.length}</span>
                    <span>🏁 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      )}

      {/* Favorites content */}
      {activeTab === 'paddock' && (
        <>
          <div className="paddock-header">
            <p className="paddock-description">
              My selected driver and constructor team for the current season
            </p>
          </div>
          
          {((paddockData.favoriteDriver && paddockData.favoriteDriver.name) || 
            (paddockData.favoriteTeam && paddockData.favoriteTeam.name)) ? (
            <div className="paddock-section">
              {paddockData.favoriteDriver && paddockData.favoriteDriver.name && (
                <div className="driver-paddock-card">
                  <img src={paddockData.favoriteDriver.avatar || '/default-avatar.png'} 
                      alt={paddockData.favoriteDriver.name} />
                  <h3>{paddockData.favoriteDriver.name}</h3>
                  <p>Team: {paddockData.favoriteDriver.team}</p>
                </div>
              )}

              {paddockData.favoriteTeam && paddockData.favoriteTeam.name && (
                <div className="team-paddock-card">
                  <img src={paddockData.favoriteTeam.logo || '/default-logo.png'} 
                      alt={paddockData.favoriteTeam.name} />
                  <h3>{paddockData.favoriteTeam.name}</h3>
                </div>
              )}
            </div>
          ) : (
            <div className="no-paddock-selection">
              <p>No driver or team selected yet</p>
            </div>
          )}
        </>
      )}

      {selectedPost && (
        <CommentModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)}
        />
        // will fix this at the end, 2 options: 1. make a custom hook which is going to have all functions, like, delete, etc..
        // 2. repeat all logic here
      )}
    </div>
    </>
  );
}

export default Profile;