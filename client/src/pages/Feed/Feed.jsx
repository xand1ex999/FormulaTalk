import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/PostCard.jsx';
import CommentModal from '../../components/CommentModal.jsx';
import './Feed.css';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import PostForm from '../../components/PostForm/PostForm.jsx';
import Pagination from '../../components/Pagination/Pagination.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePost, setActivePost] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

 const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/toggleLike`);
      const updatedPost = { ...posts.find(p => p._id === postId), likes: res.data.likes };
      setPosts(posts.map(post => post._id === postId ? updatedPost : post)); //update the specific post in the list (if _id === postId, change it to updatedPost, else keep it the same)

      if (activePost && activePost._id === postId) {
        setActivePost(updatedPost);
      }
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to like post');
    }
  };


  const handleAddComment = (postId, newComment) => {
    console.log('Adding comment to post:', postId, newComment);
    console.log("Posts:", posts);
    setPosts(prev => prev.map(p => p._id === postId ? {...p, comments: [...p.comments, newComment]} : p));
    if (activePost && activePost._id === postId) {
      setActivePost({...activePost, comments: [...activePost.comments, newComment]});
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openModal = (post) => setActivePost(post);
  const closeModal = () => setActivePost(null);

  if (loading) return <div className="feed-container"><div className="loading">Loading posts...</div></div>;
  if (error) return <div className="feed-container"><div className="error">{error}</div></div>;

  return (
    <>
    <div className="feed-layout">
      <SearchBar />
      <div className='feed-main'>
        <PostForm user={user}/>
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
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Feed;
