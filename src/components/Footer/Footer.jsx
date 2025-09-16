import React from 'react';
import './Footer.css';
import twitterLogo from '../../assets/img/Twitter-logo.jpg';
import facebookLogo from '../../assets/img/Facebook-logo.png';
import instagramLogo from '../../assets/img/Instagram-logo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-links">
            <a href="#">Contáctanos</a>
            <a href="#">Política de Privacidad</a>
          </div>
        </div>
        <p className="copyright">© 2025 Focus Room. Todos los derechos reservados.</p>
        <div className="social-buttons">
          <a href="/" className="social-btn twitter" aria-label="Twitter">
            <img src={twitterLogo} alt="Twitter" />
          </a>
          <a href="/" className="social-btn facebook" aria-label="Facebook">
            <img src={facebookLogo} alt="Facebook" />
          </a>
          <a href="/" className="social-btn instagram" aria-label="Instagram">
            <img src={instagramLogo} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;