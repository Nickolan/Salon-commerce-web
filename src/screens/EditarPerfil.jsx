import React,{useState} from 'react';
import "../styles/EditarPerfil.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import EditarLogo from "../assets/img/Editar-logo.png";

const EditarPerfil = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        DNI:"",
        ciudad:"",
        Provincia: "",
        email: "",
        telefono: "",
        nombreUsuario:"",
    });
    const provinciasArgentinas = [
    "Ciudad Autónoma de Buenos Aires","Buenos Aires",
    "Catamarca","Chaco","Chubut","Córdoba",
    "Corrientes","Entre Ríos","Formosa","Jujuy",
    "La Pampa","La Rioja","Mendoza","Misiones",
    "Neuquén","Río Negro","Salta","San Juan",
    "San Luis","Santa Cruz","Santa Fe","Santiago del Estero",
    "Tierra del Fuego","Tucumán"
    ];

    const navigate = useNavigate();

    const handleSubmit = (e) => {
  e.preventDefault();
  const { nombre, DNI, Provincia, ciudad, email, telefono, nombreUsuario, aceptaTerminos } = formData;
  let nuevosErrores = {};

  if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
  if (!DNI.trim()) nuevosErrores.DNI = "El DNI es obligatorio";
  if (!Provincia) nuevosErrores.Provincia = "La provincia es obligatoria";
  if (!ciudad.trim()) nuevosErrores.ciudad = "La ciudad es obligatoria";
  if (!email.trim()) nuevosErrores.email = "El correo es obligatorio";
  else if (!/\S+@\S+\.\S+/.test(email)) nuevosErrores.email = "El correo no es válido";
  if (!telefono.trim()) nuevosErrores.telefono = "El teléfono es obligatorio";
  if (!nombreUsuario.trim()) nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
  setErrores(nuevosErrores);

  if (Object.keys(nuevosErrores).length === 0) {
    console.log("Formulario válido:", formData);
  }
};

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
    });
};

  return (
  <div className="EditProfile-page">
    <h1>Editar Perfil</h1>
    <div className="profile-container">
      <div className="Left-container">
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ej: Lautaro Joel Ferreria"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <img src={EditarLogo} className="logo" alt="Editar" />
            <p className={`error ${errores.nombre ? "active" : ""}`}>{errores.nombre}</p>
          </div>

          <div className="form-group">
            <label htmlFor="nombreUsuario">DNI</label>
            <input
              type="text"
              id="DNI"
              name="DNI"
              placeholder="DNI"
              value={formData.DNI}
              onChange={handleChange}
              required
            />
            <img src={EditarLogo} className="logo" alt="Editar" />
            <p className={`error ${errores.DNI ? "active" : ""}`}>{errores.DNI}</p>
          </div>
          <div className="form-group">
            <label htmlFor="nombreUsuario">Provincia</label>
            <select
              id="Provincia"
              name="Provincia"
              value={formData.Provincia}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una provincia</option>
              {provinciasArgentinas.map((provincia) => (
                <option key={provincia} value={provincia}>
                  {provincia}
                </option>
              ))}
            </select>
            <img src={EditarLogo} className="logo" alt="Editar" />
            <p className={`error ${errores.Provincia ? "active" : ""}`}>{errores.Provincia}</p>
          </div>
          <div className="form-group">
            <label htmlFor="nombreUsuario">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              placeholder="Nombre de Ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
            <img src={EditarLogo} className="logo" alt="Editar" />
            <p className={`error ${errores.ciudad ? "active" : ""}`}>{errores.ciudad}</p>
          </div>
        </form>
      </div>
      <div className="Right-container">
        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            placeholder="EjemploApellido_73"
            value={formData.nombreUsuario}
            onChange={handleChange}
            required
          />
          <img src={EditarLogo} className="logo" alt="Editar" />
          <p className={`error ${errores.nombreUsuario ? "active" : ""}`}>{errores.nombreUsuario}</p>
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            placeholder='2613064573'
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          <img src={EditarLogo} className="logo" alt="Editar" />
          <p className={`error ${errores.telefono ? "active" : ""}`}>{errores.telefono}</p>
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='lautiferreria@gmali.com'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <img src={EditarLogo} className="logo" alt="Editar" />
          <p className={`error ${errores.email ? "active" : ""}`}>{errores.email}</p>
        </div>
      </div>
    </div>
  </div>
);

}

export default EditarPerfil
