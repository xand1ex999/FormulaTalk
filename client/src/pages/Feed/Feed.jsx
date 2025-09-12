import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {useParams, useNavigate } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard.jsx';
import CommentModal from '../../components/CommentModal/CommentModal.jsx';
import './Feed.css';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import PostForm from '../../components/PostForm/PostForm.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const Feed = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { postId } = useParams();

  useEffect(() => {
    if (postId && posts.length > 0) {
      const post = posts.find(p => p._id === postId);
      if (post) setActivePost(post);
    }
  }, [postId, posts]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts?page=${page}`);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
        navigate(`?page=${page}`);
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page, navigate]);

  const handlePostCreated = useCallback((newPost) => {
    setPage(1)
    setPosts(prev => [newPost, ...prev])
  },[]);

 const handleLike = useCallback(async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/toggleLike`);
      const likes = res.data.likes
      setPosts(prev => prev.map(p => p._id === postId ? {...p, likes} : p))
      setActivePost(prev => prev && prev._id === postId ? {...prev, likes} : prev)
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to like post');
    }
  },[]);


  const handleAddComment = useCallback((postId, newComment) => {
    console.log('Adding comment to post:', postId, newComment);
    setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: [...p.comments, newComment]} : p));
    setActivePost(prev => prev && prev._id === postId ? { ...prev, comments: [...prev.comments, newComment] } : prev);
  },[]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  },[totalPages]);

  const openModal = useCallback((post) => {
    setActivePost(post);               
    navigate(`/feed/posts/${post._id}`, { replace: false }); 
  },[navigate]);

  const closeModal = useCallback(() => {
    setActivePost(null);
    navigate('/feed', { replace: true });
  },[navigate]);

  if (loading) return <div className="feed-container"><div className="loading">Loading posts...</div></div>;
  if (error) return <div className="feed-container"><div className="error">{error}</div></div>;

  return (
    <>
    <div className="feed-layout">
      <SearchBar />
      <div className='feed-main'>
        <PostForm onPostCreated={handlePostCreated}/>
      <div className="feed-container">
        <div className="feed">
          {posts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              userId={userId} 
              onLike={handleLike} 
              onOpenComments={openModal} 
            />
          ))}
        </div>
        {activePost && (
          <CommentModal 
            post={activePost} 
            userId={userId} 
            onClose={closeModal} 
            onLike={handleLike} 
            onAddComment={handleAddComment} 
          />
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Feed;
