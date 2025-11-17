import React from 'react';
import './Footer.css';
// Importa los íconos que necesitas de react-icons
import { FaTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Obtenemos el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer fixed-on-bottom">
      <div className="footer-container">
        <div className="footer-links">
          {/* Es mejor usar rutas relativas o completas en lugar de '#' */}
          <Link to={"/contacto"}>Contáctanos</Link>
          <Link to={"/politica-de-privacidad"}>Política de Privacidad</Link>
          <Link to={"/terminos&condiciones"}>
            <span>Terminos y Condiciones</span>
          </Link>
        </div>

        {
          currentYear && <p className="copyright">© {currentYear} Focus Room. Todos los derechos reservados.</p>
        }
        
        
        
        <div className="social-buttons">
          {/* Reemplaza con las URLs reales de tus perfiles */}
          <Link to={"https://twitter.com/tu-usuario"} target="_blank"className="social-btn twitter">
            <FaTwitter />
          </Link>
          <Link to={"https://facebook.com/tu-pagina"} target="_blank"className="social-btn facebook" >
            <FaFacebookF />
          </Link>
          <Link to={"https://instagram.com/tu-usuario"} target="_blank"className="social-btn instagram">
            <FaInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;