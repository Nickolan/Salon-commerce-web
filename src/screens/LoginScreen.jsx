import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/features/auth/authSlice";
import "../styles/LoginScreen.css"; 
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import { FiLock } from "react-icons/fi";

function LoginScreen() {
  // ... (los hooks useState, useDispatch, etc. se mantienen IGUAL) ...
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: errorApi, isAuthenticated } = useSelector((state) => state.auth);

  const toggleContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorValidacion({});
    
    let nuevosErrores = {};
    if (!/\S+@\S+\.\S+/.test(email)) {
      nuevosErrores.email = "El formato del correo no es válido";
    }
    if (contrasenia.length < 6) {
      nuevosErrores.contrasenia = "La contraseña debe tener al menos 6 caracteres";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrorValidacion(nuevosErrores);
      return;
    }

    dispatch(loginUser({ email, contrasenia }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 1. LOGO: Añadido según Figma */}
        <h1 className="logo">FOCUS ROOM</h1>

        {/* 2. TÍTULOS: Ajustados a los nuevos textos */}
        <h2 className="login-subtitle">Iniciar Sesión</h2>
        <p className="login-welcome">Bienvenido! Ingresa a tu cuenta</p>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          
          {/* 3. INPUT DE EMAIL: con icono y nuevo contenedor */}
          <div className="input-group">
            <CiMail className="input-icon" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* El mensaje de error se muestra debajo del contenedor */}
          </div>
          <p className={`error ${errorValidacion.email ? "active" : ""}`}>{errorValidacion.email}</p>

          {/* 4. INPUT DE CONTRASEÑA: con icono, línea divisoria y toggle */}
          <div className="input-group password-group">
            <FiLock className="input-icon" />
            <input
              type={mostrarContrasenia ? "text" : "password"}
              placeholder="Contraseña"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
            {/* Línea divisoria (solo un elemento visual) */}
            <span className="input-divider"></span>
            <button
              type="button"
              className="toggle-password"
              onClick={toggleContrasenia}
              aria-label={mostrarContrasenia ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarContrasenia ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <p className={`error ${errorValidacion.contrasenia ? "active" : ""}`}>{errorValidacion.contrasenia}</p>

          {/* Link de "Olvidé mi contraseña" - AHORA ESTÁ ARRIBA DEL BOTÓN */}
          <div className="forgot-password-link">
            <Link to="/forgot-password">Olvidé mi contraseña</Link>
          </div>

          {status === 'failed' && <p className="error-api active">{errorApi}</p>}

          {/* 5. BOTÓN PRINCIPAL: Texto cambiado a "INGRESAR" */}
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>

        {/* 6. LINK DE REGISTRO: Texto actualizado */}
        <div className="login-links">
          <p>
            ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;