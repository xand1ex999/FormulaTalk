import React from 'react'
import './Header.css'
import f1Logo from '../../assets/f1Logo.png'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  }
  
  return (
    <header>
      <div className="container">
        <div className="header_items">
          <div className="header_logo">
            <img src={f1Logo} alt="f1Logo" />
          </div>
          <nav>
            {user ? 
            <>
            <ul>
              <li><Link to="/feed">Feed</Link></li>
              <li><Link to={`/profile/${user.username}`}>Profile</Link></li>
              <li><Link to="/chat">Chat</Link></li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
            </> : (
              null
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header