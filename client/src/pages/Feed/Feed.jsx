import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/PostCard.jsx';
import CommentModal from '../../components/CommentModal.jsx';
import './Feed.css';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await axios.get('/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/toggleLike`);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data.likes } : post));
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = (postId, newComment) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };

  const openModal = (post) => setActivePost(post);
  const closeModal = () => setActivePost(null);

  if (loading) return <div className="feed-container"><div className="loading">Loading posts...</div></div>;
  if (error) return <div className="feed-container"><div className="error">{error}</div></div>;

  return (
    <>
    <SearchBar/>
    <div className="feed-container">
      <div className="feed">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            user={user} 
            onLike={handleLike} 
            onOpenComments={openModal} 
          />
        ))}
      </div>
      {activePost && (
        <CommentModal 
          post={activePost} 
          user={user} 
          onClose={closeModal} 
          onLike={handleLike} 
          onAddComment={handleAddComment} 
        />
      )}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} theme="dark"/>
    </div>
    </>
  );
};

export default Feed;
