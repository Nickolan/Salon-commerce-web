import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./styles/LoginScreen.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginScreen() {

  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [errores, setErrores] = useState({});

  const toggleContraseña = () => {
    setMostrarContraseña(!mostrarContraseña);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let nuevosErrores = {};
    if (!email.includes("@")) {
      nuevosErrores.email = "El correo no es válido";
    }
    if (contraseña.length < 8) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 8 caracteres"
    }
    setErrores(nuevosErrores);
    if(Object.keys(nuevosErrores).length === 0) {
      console.log("Email: ", email, " Contraseña: ", contraseña);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido, Inicia Sesión</h1>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* {errores.email && <p className="error">{errores.email}</p>} */}
            <p className={`error ${errores.email ? "active" : ""}`}>{errores.email || " "}</p>
          </div>

          <div className="form-group password-group">
            <input
              type={mostrarContraseña ? "text" : "password"}
              name="contraseña"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <span className="toggle" onClick={toggleContraseña}>
              {mostrarContraseña ? <FaEyeSlash/> : <FaEye/>}
            </span>
            {/* {errores.contraseña && <p className="error">{errores.contraseña}</p>} */}
            <p className={`error ${errores.contraseña ? "active" : ""}`}>{errores.contraseña || " "}</p>
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

