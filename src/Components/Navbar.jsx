import React, { Fragment, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Fragment>
      <nav className="navbar navbar-light fixed-top">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <h2 className="navbar-brand">Focus Room</h2>

          <div className="buttons-container d-flex align-items-center gap-2 ms-auto">
            <button
              className="Bandera button lang-btn"
              onClick={() =>
                alert("Por ahora, solo está disponible el idioma español.")
              }
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                alt="Español"
              />
            </button>

            <Link to="/" className="desktop-only">
              <div className="button">Registrar salón</div>
            </Link>

            {user && (
              <Link to="/" className="usuario_link desktop-only">
                <div className="datos_de_usuario">
                  <img
                    src="https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"
                    alt="Usuario"
                    className="imagen_de_usuario"
                  />
                  <span className="nombre_de_usuario">Rafael Navarro</span>
                </div>
              </Link>
            )}

            <button
              className="hamburger mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  Registrar salón
                </Link>
                {user && (
                  <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                    Rafael Navarro
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

export default Navbar;
