import React from 'react'
import './Header.css'
import f1Logo from '../../assets/f1Logo.png'

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header_items">
          <div className="header_logo">
            <img src={f1Logo} alt="f1Logo" />
          </div>
          <nav>
            <ul>
              <li>fonttest</li>
              <li>second</li>
              <li>third</li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header