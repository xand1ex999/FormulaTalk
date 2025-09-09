import React, { useState } from "react";
import axios from "axios";
import "./PostForm.css";

const PostForm = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); 

  async function createPost(e) {
    e.preventDefault();
    if (content.trim().length < 1) return;

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Post created:", res.data);
      setContent("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="post-form">
      <form onSubmit={createPost}>
        <textarea
          placeholder="Share your thoughts about Formula 1..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="preview" />
            <button onClick={() => {setImage(null); setPreview(null);}} className="close-image-preview">Delete Image</button>
          </div>
        )}

        <div className="form-actions">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="media-button">
            📷 Add Photo
          </label>
          <button type="submit" className="submit-button">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
