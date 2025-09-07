// import React, { useState } from 'react'
// import axios from 'axios';
// import { useEffect } from 'react';

// const SearchBar = () => {
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     async function searchUsers(){
//       try {
//         const res = await axios.get(`/api/users?search=${query}`);
//         console.log(query);
//       } catch (error) {
//         console.error("Search error:", error);
//       }
//     }
//   }, [query]);

//   return (
//     <div style={{ marginTop: '100px' }}>
//       <input type="text" placeholder="Search..." value={query} onChange={(e)=>{setQuery(e.target.value)}} />
//     </div>
//   )
// }

// export default SearchBar