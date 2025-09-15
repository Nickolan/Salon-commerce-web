import React, { Fragment, useState } from "react";
import "./Navbar.css";
import {
  Link
} from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState({ icon: "https://i.pravatar.cc/300" }) //ACA SE PUEDE CAMBIAR POR null PARA VER QUE PASA SI EL USUARIO NO ESTA LOGUEADO;

  return (
    <Fragment>
      <nav className="navbar  navbar-light  fixed-top">
        <div className="container-fluid d-flex  align-items-center justify-content.between">
          <h2 className="navbar-brand">Focus Room</h2>

          <div className="buttons-container d-flex align-items-center gap-2 ms-auto">
            <button className="button lang-btn" onClick={() => alert("Por ahora, solo está disponible el idioma español.")}>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg"
                alt="Español"
                style={{ width: "25px" }}
              />
            </button>
            <Link to="/">
              <div className="button">Registra tu salón</div>
            </Link>
            {!user ? (
              <Link to="/">
                <div className="button">Iniciar Sesión</div>
              </Link>

            ) : (
              <Link to="/">
                <button className="boton_imagen" ><img
                  src={user.icon}
                  alt="Usuario"
                  style={{ width: "35px", borderRadius: "50%" }}
                /></button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </Fragment>
  );
}

export default Navbar;