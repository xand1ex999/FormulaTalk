import React from "react";
import tyresPattern from "../../assets/tyresPattern.jpg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundImage: `url(${tyresPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        borderTop: "01px solid #726e6eff",
        boxShadow: "0 -1px 3px rgba(255, 255, 255, 0.5)",
        marginTop: "20px",
        padding: "10px 0",
      }}
    >
      <div className="footer-container">
        <div className="footer-links">
          <a href="https://github.com/xand1ex999" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://t.me/kostiantynn999" target="_blank" rel="noreferrer">
            Telegram
          </a>
        </div>
        <div className="footer-copy">
          © 2025 FormulaTalk — pet project for learning and practice.
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
