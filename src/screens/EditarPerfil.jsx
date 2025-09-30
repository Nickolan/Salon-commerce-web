import React, { useState } from 'react';
import "../styles/EditarPerfil.css";
import { useNavigate } from "react-router-dom";
import usuariosData from "../utils/Usuarios.json";
import { LiaEditSolid } from "react-icons/lia";
import { IoSaveOutline } from "react-icons/io5";

const EditarPerfil = () => {
    const getUsuarioActual = () => {
        try {
            const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosData'));
            if (usuariosGuardados) {
                return usuariosGuardados.find(user => user.id_usuario === 4);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
        return usuariosData.find(user => user.id_usuario === 4);
    };

    const usuarioActual = getUsuarioActual();

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
        telefono: false,
        nombreUsuario: false
    });

    const [coloresCampos, setColoresCampos] = useState({
        nombre: 'purple', 
        apellido: 'purple',
        DNI: 'purple',
        ciudad: 'purple',
        Provincia: 'purple',
        telefono: 'purple',
        nombreUsuario: 'purple'
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
        setColoresCampos(prev => ({
            ...prev,
            [campo]: prev[campo] === 'purple' ? 'gray' : 'purple'
        }));
    };

    const getInputClassName = (campo) => {
        return coloresCampos[campo] === 'purple' ? 'input-purple' : 'input-gray';
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

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

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
            const exito = guardarEnJSON(formData);
            if (exito) {
                alert("Perfil actualizado correctamente");
                navigate("/perfil");
            } else {
                alert("Error al guardar los cambios");
            }
        }
    };
    
    if (!usuarioActual) {
        return <div className="EditProfile-page"><h1>Error: Usuario no encontrado</h1></div>;
    }

    return (
        <div className="EditProfile-page">
            <h1>Editar Perfil</h1>
            <div className="containers-wrapper">
                <div className="Left-container">
                    <form className="registro-form" onSubmit={handleSubmit} noValidate>
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
                                className={getInputClassName('nombre')}
                            />
                            {camposEditables.nombre ? (
                                <IoSaveOutline
                                    className="logo"
                                    onClick={() => toggleEdicion('nombre')}
                                />
                            ) : (
                                <LiaEditSolid
                                    className="logo"
                                    onClick={() => toggleEdicion('nombre')}
                                />
                            )}
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
                                    className={getInputClassName('apellido')}
                                />
                                {camposEditables.apellido ? (
                                    <IoSaveOutline
                                        className="logo"
                                        onClick={() => toggleEdicion('apellido')}
                                    />
                                ) : (
                                    <LiaEditSolid
                                        className="logo"
                                        onClick={() => toggleEdicion('apellido')}
                                    />
                                )}
                            </div>
                            <p className={`error ${errores.apellido ? "active" : ""}`}>
                                {errores.apellido}
                            </p>    
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
                                    className={getInputClassName('DNI')}
                                />
                                {camposEditables.DNI ? (
                                        <IoSaveOutline
                                            className="logo"
                                            onClick={() => toggleEdicion('DNI')}
                                        />
                                    ) : (
                                        <LiaEditSolid
                                            className="logo"
                                            onClick={() => toggleEdicion('DNI')}
                                        />
                                    )}
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
                                    className={getInputClassName('ciudad')}
                                />
                                {camposEditables.ciudad ? (
                                        <IoSaveOutline
                                            className="logo"
                                            onClick={() => toggleEdicion('ciudad')}
                                        />
                                    ) : (
                                        <LiaEditSolid
                                            className="logo"
                                            onClick={() => toggleEdicion('ciudad')}
                                        />
                                    )}
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
                                    className={getInputClassName('Provincia')}
                                >
                                    <option value="">Selecciona una provincia</option>
                                    {provinciasArgentinas.map((provincia, index) => (
                                        <option key={index} value={provincia}>
                                            {provincia}
                                        </option>
                                    ))}
                                </select>
                                {camposEditables.Provincia ? (
                                        <IoSaveOutline
                                            className="logo"
                                            onClick={() => toggleEdicion('Provincia')}
                                        />
                                    ) : (
                                        <LiaEditSolid
                                            className="logo"
                                            onClick={() => toggleEdicion('Provincia')}
                                        />
                                    )}                            
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
                                <h3 className="email-purple">{usuarioActual.email}</h3>                         
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
                                    className={getInputClassName('telefono')}
                                />
                                {camposEditables.telefono ? (
                                        <IoSaveOutline
                                            className="logo"
                                            onClick={() => toggleEdicion('telefono')}
                                        />
                                    ) : (
                                        <LiaEditSolid
                                            className="logo"
                                            onClick={() => toggleEdicion('telefono')}
                                        />
                                    )}                            
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
                                    className={getInputClassName('nombreUsuario')}
                                />
                                {camposEditables.nombreUsuario ? (
                                        <IoSaveOutline
                                            className="logo"
                                            onClick={() => toggleEdicion('nombreUsuario')}
                                        />
                                    ) : (
                                        <LiaEditSolid
                                            className="logo"
                                            onClick={() => toggleEdicion('nombreUsuario')}
                                        />
                                    )} 
                            </div>
                            <p className={`error ${errores.nombreUsuario ? "active" : ""}`}>
                                {errores.nombreUsuario}
                            </p>
                        </div>
                        <div className="form-group">
                            <div 
                                className="btn-guardar-div" 
                                onClick={handleSubmit}
                            >
                                Guardar Cambios
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfil;