import React from 'react';
import './Footer.css';
// Importa los íconos que necesitas de react-icons
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  // Obtenemos el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer fixed-bottom">
      <div className="footer-container">
        <div className="footer-links">
          {/* Es mejor usar rutas relativas o completas en lugar de '#' */}
          <a href="/contacto">Contáctanos</a>
          <a href="/politica-de-privacidad">Política de Privacidad</a>
        </div>
        
        <p className="copyright">© {currentYear} Focus Room. Todos los derechos reservados.</p>
        
        <div className="social-buttons">
          {/* Reemplaza con las URLs reales de tus perfiles */}
          <a href="https://twitter.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="social-btn twitter" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://facebook.com/tu-pagina" target="_blank" rel="noopener noreferrer" className="social-btn facebook" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="social-btn instagram" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;