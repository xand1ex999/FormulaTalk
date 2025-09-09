import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [usersFound, setUsersFound] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function searchUsers(){
      try {
        if(query.trim() === '') {
          setUsersFound([]);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/users?search=${query}`);
        setUsersFound(res.data);
      } catch (error) {
        console.error("Search error:", error);
      }
    }
    searchUsers();
  }, [query]);

  return (
    <>
    <div className='search-bar'>
      <input type="text" placeholder="Search..." value={query} onChange={(e)=>{setQuery(e.target.value)}} />
      {usersFound.length > 0 && (
      <div className='search-results'>
        <p>Search Result:</p>
        {usersFound.map(user => (
          <div className='search-user' key={user._id} onClick={()=>{navigate(`/profile/${user.username}`); setQuery(''); setUsersFound([])}}>
            <img src={user.avatar} alt="avatar" className='username-avatar' />
            <span className='username-result'>{user.username}</span>
          </div>
        ))}
      </div>
    )}
    </div>
    </>
  )
}

export default SearchBar