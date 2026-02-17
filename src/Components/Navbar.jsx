import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/features/auth/authSlice";
import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation();
  // Leemos el estado de autenticación y los datos del usuario del store
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const handleLogout = () => {
    // 1. Limpiamos Redux como ya lo hacías
    dispatch(logout());

    // 2. LIMPIEZA MANUAL DEL CHAT (La solución definitiva)
    // Borramos los historiales de ambos tipos de usuario
    localStorage.removeItem('chat_history_user');
    localStorage.removeItem('chat_history_guest');

    // Borramos el token y el usuario por si acaso Redux no llegó a tiempo al storage
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('isAuthenticated');

    // Borramos el ID de invitado para que n8n reciba una sesión nueva la próxima vez
    sessionStorage.removeItem('guest_session_id');

    // 3. Navegamos al inicio y cerramos menú
    navigate('/');
    setMenuOpen(false);

    // OPCIONAL: Forzar una recarga rápida ayuda a que todos los componentes
    // se reseteen a su estado inicial de "invitado".
    window.location.reload();
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

          {
            isAuthenticated && user && user.es_administrador && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                <div className="button">Administracion</div>
              </Link>
            )
          }

          {isAuthenticated && user && currentPath !== '/publicar' && (
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