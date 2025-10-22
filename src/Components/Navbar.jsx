import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // <-- Hooks de Redux
import { logout } from "../store/features/auth/authSlice"; // <-- Acción de logout
import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  // Leemos el estado de autenticación y los datos del usuario del store
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  

  return (
    <Fragment>
      <nav className="navbar">
        <div className="container-fluid">
          <Link to={'/'}>
            <h2>Focus Room</h2>
          </Link>

          <div className="buttons-container">
            {
              isAuthenticated && user && (
                <Link to="/publicar">
                  <div className="button">Registra tu salón</div>
                </Link>

              )
            }

            {isAuthenticated && user ? (
              // Vista para usuario logueado
              <div className="datos_de_usuario">
                <Link to="/perfil" className="usuario_link">
                  <img 
                    src={user.foto_perfil || "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"}
                    alt="Usuario"
                    className="imagen_de_usuario"
                  />
                  <span className="nombre_de_usuario">
                    {user.nombre} {user.apellido}
                  </span>
                </Link>
                {/* Botón de Logout */}
                {/* <button onClick={handleLogout} className="button">
                  Cerrar Sesión
                </button> */}
              </div>
            ) : (
              // Vista para usuario no logueado
              <Link to="/login">
                <div className="button">Iniciar Sesión</div>
              </Link>
              
            )}

            <button onClick={handleLogout} className="button">
                  Cerrar Sesión
                </button>
            
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

export default Navbar;