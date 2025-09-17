import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginScreen.css";
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
    // Una validación de email un poco más robusta
    if (!/\S+@\S+\.\S+/.test(email)) {
      nuevosErrores.email = "El formato del correo no es válido";
    }
    if (contraseña.length < 8) {
      nuevosErrores.contraseña = "La contraseña debe tener al menos 8 caracteres";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      console.log("Formulario enviado con éxito:", { email, contraseña });
      // Aquí iría la lógica para enviar los datos al backend
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido, Inicia Sesión</h1>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            {/* Añadido para accesibilidad */}
            <label htmlFor="email" className="sr-only">Correo Electrónico</label>
            <input
              type="email"
              id="email" // ID para conectar con el label
              name="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={errores.email ? "true" : "false"} // Para accesibilidad
            />
            <p className={`error ${errores.email ? "active" : ""}`}>{errores.email}</p>
          </div>

          <div className="form-group password-group">
            {/* Añadido para accesibilidad */}
            <label htmlFor="contraseña" className="sr-only">Contraseña</label>
            <input
              type={mostrarContraseña ? "text" : "password"}
              id="contraseña" // ID para conectar con el label
              name="contraseña"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              aria-invalid={errores.contraseña ? "true" : "false"} // Para accesibilidad
            />
            {/* Convertido a <button> para mejor semántica y accesibilidad */}
            <button type="button" className="toggle-password" onClick={toggleContraseña} aria-label="Mostrar u ocultar contraseña">
              {mostrarContraseña ? <FaEyeSlash/> : <FaEye/>}
            </button>
            <p className={`error ${errores.contraseña ? "active" : ""}`}>{errores.contraseña}</p>
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

export default LoginScreen;