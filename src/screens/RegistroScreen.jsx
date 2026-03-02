import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from "../store/features/auth/authSlice";
import "../styles/RegistroScreen.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { FiLock } from "react-icons/fi";
import Swal from 'sweetalert2';

function RegistroScreen() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    contraseña2: "",
    aceptaTerminos: false,
  });

  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarContraseña2, setMostrarContraseña2] = useState(false);
  const [errores, setErrores] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: errorApi } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, apellido, email, contraseña, contraseña2, aceptaTerminos } = formData;
    let nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
    if (!/\S+@\S+\.\S+/.test(email)) nuevosErrores.email = "El correo no es válido";
    if (contraseña.length < 6) nuevosErrores.contraseña = "Debe tener al menos 6 caracteres";
    if (contraseña !== contraseña2) nuevosErrores.contraseña2 = "Las contraseñas no coinciden";
    if (!aceptaTerminos) nuevosErrores.aceptaTerminos = "Debes aceptar los términos";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      dispatch(registerUser({ nombre, apellido, email, contraseña }));
    }
  };

  useEffect(() => {
    if (status === 'succeeded') {
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      }).then(() => {
        navigate("/login");
      });
    }
  }, [status, navigate]);

  return (
    <div className="registro-page">
      <div className="registro-container">
        {/* Logo igual que en login */}
        <h1 className="logo">FOCUS ROOM</h1>

        {/* Títulos */}
        <h2 className="registro-subtitle">Crear Cuenta</h2>
        <p className="registro-welcome">Únete para publicar o reservar espacios únicos</p>
        
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          
          {/* FILA DE NOMBRE Y APELLIDO */}
          <div className="form-row">
            <div className="input-group">
              <CiUser className="input-icon" />
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <CiUser className="input-icon" />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Errores de nombre y apellido */}
          <div className="error-row">
            <p className={`error ${errores.nombre ? "active" : ""}`}>{errores.nombre}</p>
            <p className={`error ${errores.apellido ? "active" : ""}`}>{errores.apellido}</p>
          </div>

          {/* INPUT DE EMAIL */}
          <div className="input-group">
            <CiMail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <p className={`error ${errores.email ? "active" : ""}`}>{errores.email}</p>

          {/* INPUT DE CONTRASEÑA */}
          <div className="password-group">
            <FiLock className="input-icon" />
            <input
              type={mostrarContraseña ? "text" : "password"}
              name="contraseña"
              placeholder="Contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            <span className="input-divider"></span>
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              aria-label={mostrarContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarContraseña ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <p className={`error ${errores.contraseña ? "active" : ""}`}>{errores.contraseña}</p>

          {/* INPUT DE REPETIR CONTRASEÑA */}
          <div className="password-group">
            <FiLock className="input-icon" />
            <input
              type={mostrarContraseña2 ? "text" : "password"}
              name="contraseña2"
              placeholder="Repetir Contraseña"
              value={formData.contraseña2}
              onChange={handleChange}
              required
            />
            <span className="input-divider"></span>
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setMostrarContraseña2(!mostrarContraseña2)}
              aria-label={mostrarContraseña2 ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {mostrarContraseña2 ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <p className={`error ${errores.contraseña2 ? "active" : ""}`}>{errores.contraseña2}</p>

          {/* CHECKBOX DE TÉRMINOS */}
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
              />
              <span className="custom-checkbox"></span>
              <p>
                Acepto los <Link to='/terminos&condiciones' target="_blank" rel="noopener noreferrer">Términos y Condiciones</Link>
              </p>
            </label>
            <p className={`error ${errores.aceptaTerminos ? "active" : ""}`}>{errores.aceptaTerminos}</p>
          </div>

          {status === 'failed' && <p className="error-api active">{errorApi}</p>}

          {/* BOTÓN "INGRESAR" (REGISTRARSE) */}
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? "Registrando..." : "INGRESAR"}
          </button>
        </form>

        {/* LINK A LOGIN */}
        <div className="registro-links">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistroScreen;