import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Profile.css' 

const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    avatar: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
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
                  className="save-btn"
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
          <h1 className="profile-username">{profileData.username}</h1>
          <p className="profile-join-date">Joined {joinDate}</p>
        </div>
      </div>

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
    </div>
  );
}

export default Profile;