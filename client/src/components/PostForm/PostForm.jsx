import React, { useState } from "react";
import axios from "axios";
import "./PostForm.css";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  async function createPost(e) {
    e.preventDefault();
    if (content.trim().length < 1) return;

    const formData = new FormData();
    formData.append("content", content);
    files.forEach(file => formData.append("files", file));

    try {
      const res = await axios.post("/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Post created:", res.data);
      setContent("");
      setFiles([]);
      previews.forEach(p => URL.revokeObjectURL(p)); 
      setPreviews([]);
      if (onPostCreated) {
        onPostCreated(res.data);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="post-form">
      <form onSubmit={createPost}>
        <textarea
          placeholder="Share your thoughts about Formula 1..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {previews.map((preview, index) => (
          <div key={index} className="image-preview">
            <img src={preview} alt={`preview-${index}`} />
            <button
              type="button"
              className="close-image-preview"
              onClick={() => handleRemoveFile(index)}
            >
              ❌
            </button>
          </div>
        ))}

        <div className="form-actions">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            multiple
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="media-button">
            📷 Add Media
          </label>
          <button type="submit" className="submit-button">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(PostForm);
