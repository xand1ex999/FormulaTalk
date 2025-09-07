import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "./Feed.css";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [commentTexts, setCommentTexts] = useState({});
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);

  // Загружаем все посты
  useEffect(() => {
    async function fetchAllPosts() {
      try {
        setLoading(true);
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error loading posts:", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    }
    fetchAllPosts();
  }, []);

  // Лайк
  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/toggleLike`);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );
      // обновляем лайки и в модалке
      if (activePost && activePost._id === postId) {
        setActivePost((prev) => ({ ...prev, likes: res.data.likes }));
      }
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  // Инпут комментария
  const handleInputChange = (postId, value) => {
    setCommentTexts((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Добавление комментария
  const handleComment = async (postId) => {
    try {
      const text = commentTexts[postId] || "";
      if (!text.trim()) return;

      const res = await axios.post(`/api/posts/${postId}/comments`, {
        comment: text,
      });

      const newComment = res.data; // контроллер возвращает объект коммента

      setCommentTexts((prev) => ({
        ...prev,
        [postId]: "",
      }));

      // обновляем state posts
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        )
      );

      // если открыта модалка на этом посте — обновим её
      if (activePost && activePost._id === postId) {
        setActivePost((prev) => ({
          ...prev,
          comments: [...prev.comments, newComment],
        }));
      }

      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  // Формат даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Открытие модалки с подгрузкой свежих комментариев
  const openCommentModal = async (post) => {
    try {
      const res = await axios.get(`/api/posts/${post._id}/comments`);
      setActivePost({ ...post, comments: res.data });
      setIsCommentModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const closeCommentModal = () => {
    console.log(activePost);
    
    setActivePost(null);
    setIsCommentModalOpen(false);
  };

  // Loader & error
  if (loading)
    return (
      <div className="feed-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  if (error)
    return (
      <div className="feed-container">
        <div className="error">{error}</div>
      </div>
    );

  return (
    <>
      {/* Модалка */}
      {isCommentModalOpen && activePost && (
        <div className="comment-modal" onClick={closeCommentModal}>
          <div
            className="comment-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-left">
              {activePost.image ? (
                <img
                  src={activePost.image}
                  alt="Post"
                  className="modal-post-image"
                />
              ) : (
                <div className="no-image">No image</div>
              )}
            </div>
            <div className="modal-right">
              <div className="modal-header">
                <img
                  src={
                    activePost.author.avatar ||
                    `https://ui-avatars.com/api/?name=${activePost.author.username}&background=random`
                  }
                  alt={activePost.author.username}
                  className="author-avatar"
                />
                <span className="author-username">
                  {activePost.author.username}
                </span>
                <button className="close-modal" onClick={closeCommentModal}>
                  ×
                </button>
              </div>

              <div className="modal-post-content">
                <span className="author-username">
                  {activePost.author.username}
                </span>
                <span className="author-description">
                  {activePost.content}
                </span>
              </div>

              {/* Comments */}
              <div className="modal-comments">
                {activePost.comments.length > 0 ? (
                  activePost.comments.map((comment) => (
                    <div key={comment._id} className="modal-comment">
                      <img
                        src={
                          comment.author.avatar ||
                          `https://ui-avatars.com/api/?name=${comment.author.username}&background=random`
                        }
                        alt={comment.author.username}
                        className="comment-avatar"
                      />
                      <span className="comment-author">
                        {comment.author.username}
                      </span>
                      <span className="comment-text">{comment.text}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">No comments yet.</p>
                )}
              </div>

              {/* Лайки */}
              <div className="modal-actions">
                <button
                  className={`like-btn ${
                    activePost.likes.includes(user?._id) ? "liked" : ""
                  }`}
                  onClick={() => handleLike(activePost._id)}
                >
                  ❤️
                </button>
                <p className="like-count">
                  {activePost.likes.length} like
                  {activePost.likes.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Добавить комментарий */}
              <div className="modal-add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentTexts[activePost._id] || ""}
                  onChange={(e) =>
                    handleInputChange(activePost._id, e.target.value)
                  }
                />
                <button onClick={() => handleComment(activePost._id)}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Лента */}
      <div className="feed-container">
        <div className="feed">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div
                  className="post-author"
                  onClick={() => {
                    navigate(`/profile/${post.author.username}`);
                  }}
                >
                  <img
                    src={
                      post.author.avatar ||
                      `https://ui-avatars.com/api/?name=${post.author.username}&background=random`
                    }
                    alt={post.author.username}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <span className="author-username">
                      {post.author.username}
                    </span>
                    <span className="post-time">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
                <button className="post-more">⋯</button>
              </div>

              {post.image && (
                <div className="post-image-container">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="post-image"
                  />
                </div>
              )}

              <div className="post-actions">
                <button
                  className={`like-btn ${
                    post.likes.includes(user?._id) ? "liked" : ""
                  }`}
                  onClick={() => handleLike(post._id)}
                >
                  ❤️
                </button>
                <button
                  className="comment-btn"
                  onClick={() => openCommentModal(post)}
                >
                  💬
                </button>
              </div>

              <div className="post-likes">
                {post.likes.length > 0 && (
                  <span>
                    {post.likes.length} like
                    {post.likes.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="post-content">
                <span className="author-username">{post.author.username}</span>
                <span className="post-text">{post.content}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        theme="dark"
      />
    </>
  );
};

export default Feed;
