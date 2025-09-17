import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegistroScreen.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegistroScreen() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
    contraseña2: "",
    aceptaTerminos: false,
  });

  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarContraseña2, setMostrarContraseña2] = useState(false);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  // Un solo manejador para todos los inputs de texto
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, contraseña, contraseña2, aceptaTerminos } = formData;
    let nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!/\S+@\S+\.\S+/.test(email)) nuevosErrores.email = "El correo no es válido";
    if (contraseña.length < 8) nuevosErrores.contraseña = "Debe tener al menos 8 caracteres";
    if (contraseña !== contraseña2) nuevosErrores.contraseña2 = "Las contraseñas no coinciden";
    if (!aceptaTerminos) nuevosErrores.aceptaTerminos = "Debes aceptar los términos";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      console.log("Registro exitoso:", formData);
      navigate("/login"); // Redirige al usuario
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h1>Bienvenido, Regístrate</h1>
        
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nombre" className="sr-only">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre Completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <p className={`error ${errores.nombre ? "active" : ""}`}>{errores.nombre}</p>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="sr-only">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className={`error ${errores.email ? "active" : ""}`}>{errores.email}</p>
          </div>

          <div className="form-group password-group">
            <label htmlFor="contraseña" className="sr-only">Contraseña</label>
            <input
              type={mostrarContraseña ? "text" : "password"}
              id="contraseña"
              name="contraseña"
              placeholder="Contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-password" onClick={() => setMostrarContraseña(!mostrarContraseña)}>
              {mostrarContraseña ? <FaEyeSlash /> : <FaEye />}
            </button>
            <p className={`error ${errores.contraseña ? "active" : ""}`}>{errores.contraseña}</p>
          </div>

          <div className="form-group password-group">
            <label htmlFor="contraseña2" className="sr-only">Repetir Contraseña</label>
            <input
              type={mostrarContraseña2 ? "text" : "password"}
              id="contraseña2"
              name="contraseña2"
              placeholder="Repetir Contraseña"
              value={formData.contraseña2}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-password" onClick={() => setMostrarContraseña2(!mostrarContraseña2)}>
              {mostrarContraseña2 ? <FaEyeSlash /> : <FaEye />}
            </button>
            <p className={`error ${errores.contraseña2 ? "active" : ""}`}>{errores.contraseña2}</p>
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="aceptaTerminos">
              <input
                type="checkbox"
                id="aceptaTerminos"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                required
              />
              <span className="custom-checkbox"></span>
              Acepto los <a href="/terminos.pdf" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
            </label>
            <p className={`error ${errores.aceptaTerminos ? "active" : ""}`}>{errores.aceptaTerminos}</p>
          </div>

          <button type="submit" className="btn-primary">
            Continuar
          </button>
        </form>

        <div className="registro-links">
          <Link to="/login">Ya tengo una cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default RegistroScreen;