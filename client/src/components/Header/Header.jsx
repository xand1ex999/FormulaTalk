import React, { useState } from 'react'
import './Header.css'
import f1Logo from '../../assets/f1Logo.png'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import tyresPattern from '../../assets/tyresPattern.jpg'

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [ menuOpen, setMenuOpen ] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate("/auth");
  }

  return (
    <header
      style={{
        backgroundImage: `url(${tyresPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto"
      }}
    >
      <div className="container">
        <div className="header_items">
          <div className="header_logo">
            <img src={f1Logo} alt="f1Logo" onClick={() => {navigate("/feed")}} />
          </div>

          {user && (
            <>
              <div className={`burger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <nav className={menuOpen ? "active" : ""}>
                <ul>
                  <li><Link to="/feed" onClick={() => setMenuOpen(false)}>Feed</Link></li>
                  <li><Link to={`/profile/${user.username}`} onClick={() => setMenuOpen(false)}>Profile</Link></li>
                  <li><Link to="/fantasy" onClick={() => setMenuOpen(false)}>F1 Fantasy</Link></li>
                  <li><Link to="/chat" onClick={() => setMenuOpen(false)}>Chat</Link></li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header