import React, { useState, useCallback } from "react";
import api from '../../api.js'
import "./PostForm.css";
import { toast } from "react-toastify";

const PostForm = ({ onPostCreated }) => {
  const [ content, setContent ] = useState("");
  const [ files, setFiles ] = useState([]);
  const [ previews, setPreviews ] = useState([]);
  
  async function createPost(e) {
    e.preventDefault();
    if (content.trim().length < 1) return;

    const formData = new FormData();
    formData.append("content", content);
    if(files.length > 10 ){
      toast.error('Maximum amount of 10 pictures')
      return;
    }
    files.forEach(file => formData.append("files", file));

    try {
      const res = await api.post("/posts", formData);
      toast.success("Post created")
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

  const handleFileChange = useCallback((e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const handleRemoveFile = useCallback((index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }, [previews]);

  return (
    <div className="post-form">
      <form onSubmit={createPost}>
        <textarea
          placeholder="Share your thoughts about Formula 1..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={e => {
            if(e.key === "Enter"){
              e.preventDefault();
              createPost(e)
            }
          }}
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
