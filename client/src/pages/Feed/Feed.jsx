import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard.jsx';
import NextRace from '../../components/NextRace/NextRace.jsx';

const Feed = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { postId } = useParams();
  const navigate = useNavigate();
  const [ posts, setPosts ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ activePost, setActivePost ] = useState(null);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page')) || 1;  
  const [ page, setPage ] = useState(pageParam);
  const [ totalPages, setTotalPages ] = useState(1);
  const [ newContext, setNewContext ] = useState('');

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
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [page]);

  const handlePostCreated = useCallback((newPost) => {
    setPage(1)
    setPosts(prev => [newPost, ...prev])
  },[]);

  const handlePostDeleted = useCallback((deletedPostId) => {
    setPosts(prev => prev.filter(p => p._id !== deletedPostId));
  }, []);
  
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
    // console.log('Adding comment to post:', postId, newComment);
    setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: [...p.comments, newComment]} : p));
    setActivePost(prev => prev && prev._id === postId ? { ...prev, comments: [...prev.comments, newComment] } : prev);
  },[]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setSearchParams({ page: newPage });
    }
  }, [totalPages, setSearchParams]);

  const handleDeleteComment = useCallback(async (postId, commentId) => {
    try {
      const res = await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
      setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: p.comments.filter(c => c._id !== commentId)} : p)); //I need both states for immutable state update
      setActivePost(prev => prev && prev._id === postId ? { ...prev, comments: prev.comments.filter(c => c._id !== commentId) } : prev);
      toast.success(res.data.message)
    } catch (error) {
      console.error("Error", error)
      toast.error("Failed to delete comment")
    }
  }, []);

  const handleChangeComment = useCallback(async (postId, commentId, newText) => {
    try {
      const res = await axios.patch(`/api/posts/${postId}/comments/${commentId}`, {
        comment: newText
      })
      setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: p.comments.map(c => c._id === commentId ? {...c, text: res.data.text} : c)} : p ));
      setActivePost(prev => prev && prev._id === postId ? {...prev, comments: prev.comments.map(c => c._id === commentId ? {...c, text: res.data.text} : c)} : prev );
      toast.success("Comment updated!");
    } catch (error) {
      console.error("Error", error)
      toast.error("Failed to change comment")
    }
  }, []);
  
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
      <div className="app-container">
        <div className="next-race-section">
          <NextRace />
        </div>
      <div className="feed-layout">
        {/* LEFT */}
        <div className="sidebar-left">
          <SearchBar />
        </div>

        {/* MIDDLE */}
        <div className="feed-main">
          <div className="post-form-container">
            <PostForm onPostCreated={handlePostCreated}/>
          </div>
          <div className="feed-container">
            <div className="feed">
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  userId={userId} 
                  onLike={handleLike} 
                  onOpenComments={openModal} 
                  onPostDeleted={handlePostDeleted}
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
                handleDeleteComment={handleDeleteComment}
                handleChangeComment={handleChangeComment}
              />
            )}
          </div>
          
          <div className="pagination-container">
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>

          {/* RIGHT */}
          <div className="sidebar-right">
            <LeaderBoard/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feed;
