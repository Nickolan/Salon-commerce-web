import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/features/auth/authSlice";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // Leemos el estado de autenticación y los datos del usuario del store
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        {/* Logo normal como en tu versión original */}
        <Link to="/" className="navbar-title">
          <h2>Focus Room</h2>
        </Link>

        {/* Botón hamburguesa (solo visible en pantallas pequeñas) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Contenedor de botones */}
        <div className={`buttons-container ${menuOpen ? "active" : ""}`}>
          {isAuthenticated && user && (
            <Link to="/publicar" onClick={() => setMenuOpen(false)}>
              <div className="button">Registra tu salón</div>
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="datos_de_usuario">
              <Link
                to="/perfil"
                className="usuario_link"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src={
                    user.foto_perfil ||
                    "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"
                  }
                  alt="Usuario"
                  className="imagen_de_usuario"
                />
                <span className="nombre_de_usuario">
                  {user.nombre} {user.apellido}
                </span>
              </Link>

              <button onClick={handleLogout} className="button">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <div className="button">Iniciar Sesión</div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;