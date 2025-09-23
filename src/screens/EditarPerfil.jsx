import React, { useState, useEffect } from 'react';
import "../styles/EditarPerfil.css";
import { useNavigate } from "react-router-dom";
import EditarLogo from "../assets/img/Editar-logo.png";
import usuariosData from "../utils/Usuarios.json";

const EditarPerfil = () => {
    const usuarioActual = usuariosData.find(user => user.id_usuario === 4);
    
    const [formData, setFormData] = useState({
        nombre: usuarioActual?.nombre || "",
        apellido: usuarioActual?.apellido || "",
        DNI: usuarioActual?.dni || "",
        ciudad: usuarioActual?.ciudad || "",
        Provincia: usuarioActual?.provincia || "",
        email: usuarioActual?.email || "",
        telefono: usuarioActual?.telefono || "",
        nombreUsuario: usuarioActual?.nombre_usuario || "",
    });

    const [camposEditables, setCamposEditables] = useState({
        nombre: false,
        apellido: false,
        DNI: false,
        ciudad: false,
        Provincia: false,
        email: false,
        telefono: false,
        nombreUsuario: false
    });

    const [errores, setErrores] = useState({});
    const navigate = useNavigate();

    const provinciasArgentinas = [
        "Ciudad Autónoma de Buenos Aires", "Buenos Aires",
        "Catamarca", "Chaco", "Chubut", "Córdoba",
        "Corrientes", "Entre Ríos", "Formosa", "Jujuy",
        "La Pampa", "La Rioja", "Mendoza", "Misiones",
        "Neuquén", "Río Negro", "Salta", "San Juan",
        "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero",
        "Tierra del Fuego", "Tucumán"
    ];

    const toggleEdicion = (campo) => {
        setCamposEditables(prev => ({
            ...prev,
            [campo]: !prev[campo]
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (camposEditables[name]) {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const guardarEnJSON = (datosActualizados) => {
        const usuariosActualizados = [...usuariosData];
        const index = usuariosActualizados.findIndex(user => user.id_usuario === 4);
        
        if (index !== -1) {
            usuariosActualizados[index] = {
                ...usuariosActualizados[index],
                nombre: datosActualizados.nombre,
                apellido: datosActualizados.apellido,
                dni: datosActualizados.DNI,
                ciudad: datosActualizados.ciudad,
                provincia: datosActualizados.Provincia,
                email: datosActualizados.email,
                telefono: datosActualizados.telefono,
                nombre_usuario: datosActualizados.nombreUsuario
            };
            console.log("Datos actualizados para guardar:", usuariosActualizados[index]);
            
            return true;
        }
        return false;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nombre, apellido, DNI, Provincia, ciudad, email, telefono, nombreUsuario } = formData;
        let nuevosErrores = {};

        // Validaciones
        if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
        if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
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
            const guardadoExitoso = guardarEnJSON(formData);
            
            if (guardadoExitoso) {
                alert("Perfil actualizado correctamente");
                navigate("/perfil");
            } else {
                alert("Error al guardar los cambios");
            }
        }
    };

    if (!usuarioActual) {
        return (
            <div className="EditProfile-page">
                <h1>Error: Usuario no encontrado</h1>
                <p>No se pudo cargar la información del usuario.</p>
            </div>
        );
    }

    return (
        <div className="EditProfile-page">
            <h1>Editar Perfil</h1>
            <div className="containers-wrapper">
                <div className="Left-container">
                    <form className="registro-form" onSubmit={handleSubmit} noValidate>
                        
                        <div className="form-row">
                            <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ej: Lautaro"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={!camposEditables.nombre}
                                    required
                                />
                                <img 
                                    src={EditarLogo} 
                                    className="logo" 
                                    alt="Editar" 
                                    onClick={() => toggleEdicion("nombre")}
                                />
                            </div>
                            <p className={`error ${errores.nombre ? "active" : ""}`}>
                                {errores.nombre}
                            </p>
                        </div>

                            <div className="form-group">
                                <label htmlFor="apellido">Apellido</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        placeholder="Ej: Ferreria"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        disabled={!camposEditables.apellido}
                                        required
                                    />
                                    <img 
                                        src={EditarLogo} 
                                        className="logo" 
                                        alt="Editar" 
                                        onClick={() => toggleEdicion("apellido")}
                                    />
                                </div>
                                <p className={`error ${errores.apellido ? "active" : ""}`}>
                                    {errores.apellido}
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="DNI">DNI</label>
                            <div className="input-container">
                                <input
                                  type="text"
                                  id="DNI"
                                  name="DNI"
                                  placeholder="DNI"
                                  value={formData.DNI}
                                  onChange={handleChange}
                                  disabled={!camposEditables.DNI}
                                  required
                              />
                                <img 
                                    src={EditarLogo} 
                                    className="logo" 
                                    alt="Editar" 
                                    onClick={() => toggleEdicion("DNI")}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            <p className={`error ${errores.DNI ? "active" : ""}`}>
                                {errores.DNI}
                            </p>
                        </div>
                          <div className="form-group">
                          <label htmlFor="ciudad">Ciudad</label>
                          <div className="input-container">
                                <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                disabled={!camposEditables.ciudad}
                                required
                                />
                              <img 
                                  src={EditarLogo} 
                                  className="logo" 
                                  alt="Editar" 
                                  onClick={() => toggleEdicion("ciudad")}
                                  style={{ cursor: 'pointer' }}
                              />
                          </div>
                          <p className={`error ${errores.ciudad ? "active" : ""}`}>
                              {errores.ciudad}
                          </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="Provincia">Provincia</label>
                            <div className="input-container">
                                <select
                                    id="Provincia"
                                    name="Provincia"
                                    value={formData.Provincia}
                                    onChange={handleChange}
                                    disabled={!camposEditables.Provincia}
                                    required
                                >
                                <option value="">Selecciona una provincia</option>
                                {provinciasArgentinas.map((provincia, index) => (
                                    <option key={index} value={provincia}>
                                        {provincia}
                                    </option>
                                ))}
                              </select>
                              <img 
                                  src={EditarLogo} 
                                  className="logo" 
                                  alt="Editar" 
                                  onClick={() => toggleEdicion("Provincia")}
                                  style={{ cursor: 'pointer' }}
                              />                            
                            </div>
                            <p className={`error ${errores.Provincia ? "active" : ""}`}>
                                {errores.Provincia}
                            </p>
                        </div>
                    </form>
                </div>
                <div className="Right-container">
                    <form className="registro-form" onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-container">
                                <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!camposEditables.email}
                                required
                                />
                                <img 
                                    src={EditarLogo} 
                                    className="logo" 
                                    alt="Editar" 
                                    onClick={() => toggleEdicion("email")}
                                    style={{ cursor: 'pointer' }}
                                />                          
                            </div>
                            <p className={`error ${errores.email ? "active" : ""}`}>
                                {errores.email}
                            </p>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <div className="input-container">
                                <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                placeholder="Teléfono"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={!camposEditables.telefono}
                                required
                                />
                                <img 
                                    src={EditarLogo} 
                                    className="logo" 
                                    alt="Editar" 
                                    onClick={() => toggleEdicion("telefono")}
                                    style={{ cursor: 'pointer' }}
                                />                            
                            </div>
                            <p className={`error ${errores.telefono ? "active" : ""}`}>
                                {errores.telefono}
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombreUsuario">Nombre de Usuario</label>
                            <div className="input-container">
                            <input
                                type="text"
                                id="nombreUsuario"
                                name="nombreUsuario"
                                placeholder="Nombre de Usuario"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                disabled={!camposEditables.nombreUsuario}
                                required
                            />
                            <img 
                                src={EditarLogo} 
                                className="logo" 
                                alt="Editar" 
                                onClick={() => toggleEdicion("nombreUsuario")}
                                style={{ cursor: 'pointer' }}
                            />
                            <p className={`error ${errores.nombreUsuario ? "active" : ""}`}>
                                {errores.nombreUsuario}
                            </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfil;