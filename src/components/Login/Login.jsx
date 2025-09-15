import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido, Inicia Sesión</h1>
        
        <form className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </form>

        <div className="login-links">
          <Link to="/recuperar-contraseña">Olvidé mi contraseña</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

