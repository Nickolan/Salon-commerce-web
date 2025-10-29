import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // <-- Hooks de Redux
import { loginUser } from "../store/features/auth/authSlice"; // <-- Nuestro thunk
import "../styles/LoginScreen.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Seleccionamos el estado de autenticación del store global
  const { status, error: errorApi, isAuthenticated } = useSelector((state) => state.auth);

  const toggleContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  // Efecto para redirigir si el login es exitoso
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirige al home o al dashboard
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

    // Despachamos la acción asíncrona con las credenciales
    dispatch(loginUser({ email, contrasenia }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bienvenido, Inicia Sesión</h1>
        
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* ... inputs de email y contraseña (sin cambios aquí) ... */}
           <div className="form-group">
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className={`error ${errorValidacion.email ? "active" : ""}`}>{errorValidacion.email}</p>
          </div>

          <div className="form-group password-group">
            <input
              type={mostrarContrasenia ? "text" : "password"}
              placeholder="Contraseña"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
            />
            <button type="button" className="toggle-password" onClick={toggleContrasenia}>
              {mostrarContrasenia ? <FaEyeSlash/> : <FaEye/>}
            </button>
            <p className={`error ${errorValidacion.contrasenia ? "active" : ""}`}>{errorValidacion.contrasenia}</p>
          </div>

          {status === 'failed' && <p className="error-api active">{errorApi}</p>}

          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/forgot-password">Olvidé mi contraseña</Link>
          <Link to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;