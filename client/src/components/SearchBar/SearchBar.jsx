import React, { memo, useState, useEffect } from 'react'
import api from '../../api.js';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [ query, setQuery ] = useState('');
  const [ usersFound, setUsersFound ] = useState([]);

  useEffect(() => {
    async function searchUsers(){
      try {
        if(query.trim() === '') {
          setUsersFound([]);
          return;
        }
        const res = await api.get(`/users?search=${query}`);
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
      <input type="text" placeholder="Search..." value={query} onChange={(e) => {setQuery(e.target.value)}} />
      {usersFound.length > 0 && (
      <div className='search-results'>
        <p>Search Result:</p>
        {usersFound.map(user => (
          <div className='search-user' key={user._id} onClick={() => {navigate(`/profile/${user.username}`); setQuery(''); setUsersFound([])}}>
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="avatar" className='username-avatar' loading="lazy" />
            <span className='username-result'>{user.username}</span>
          </div>
        ))}
      </div>
    )}
    </div>
    </>
  )
};

export default React.memo(SearchBar);