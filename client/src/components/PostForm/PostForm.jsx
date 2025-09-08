import React, { useState } from 'react'
import axios from 'axios'
import './PostForm.css'


const PostForm = ({user}) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  async function createPost(){
    if(!content) return;
    try {
      const res = await axios.post('/api/posts', {content, image});
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

  return (
    <>
    <div className='post-form'>
      <form action="submit" onSubmit={e => e.preventDefault()}>
        <input 
        type="text"
        placeholder='What is on your mind?'
        value={content}
        onChange={(e)=>{setContent(e.target.value)}} />
        <button type='submit' onClick={createPost}>Post</button>
      </form>
      <div className='media-button'>
        <button>📷</button>
      </div>
    </div>
    </>
  )
}

export default PostForm