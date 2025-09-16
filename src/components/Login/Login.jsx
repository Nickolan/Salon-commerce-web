import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {

  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const toggleContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

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

          <div className="form-group password-group">
            <input
              type={mostrarContraseña ? "text" : "password"}
              name="contraseña"
              placeholder="Contraseña"
              required
            />
            <span className="toggle" onClick={toggleContraseña}>
              {mostrarContraseña ? "🙈" : "👁️"}
            </span>
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

