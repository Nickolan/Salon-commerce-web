import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/features/auth/authSlice';
import Swal from 'sweetalert2'; // Usaremos SweetAlert2 para notificaciones más bonitas

import "../styles/EditarPerfil.css";
import { LiaEditSolid } from "react-icons/lia";
import { IoSaveOutline } from "react-icons/io5";
import Sidebar from '../components/Sidebar/Sidebar';

const EditarPerfil = () => {
    // 1. Obtenemos los datos del usuario y el estado de la API desde Redux
    const { user: usuarioActual, status } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 2. El estado local del formulario se inicializa con los datos del usuario del store
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        ciudad: '',
        provincia: '',
        telefono: '',
        nombre_usuario: '',
    });

    // Estados para la UI (estos se quedan como locales, está bien)
    const [camposEditables, setCamposEditables] = useState({});
    const [errores, setErrores] = useState({});

    const [coloresCampos, setColoresCampos] = useState({
        nombre: 'purple', 
        apellido: 'purple',
        DNI: 'purple',
        ciudad: 'purple',
        Provincia: 'purple',
        telefono: 'purple',
        nombreUsuario: 'purple'
    });

    // 3. Sincronizamos el estado local del formulario cuando los datos del usuario en Redux cargan
    useEffect(() => {
        if (usuarioActual) {
            setFormData({
                nombre: usuarioActual.nombre || "",
                apellido: usuarioActual.apellido || "",
                dni: usuarioActual.dni || "",
                ciudad: usuarioActual.ciudad || "",
                provincia: usuarioActual.provincia || "",
                telefono: usuarioActual.telefono || "",
                nombre_usuario: usuarioActual.nombre_usuario || "",
            });
        }
    }, [usuarioActual]);

    const provinciasArgentinas = ["Ciudad Autónoma de Buenos Aires", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"];

    // Lógica de la UI para habilitar/deshabilitar campos (sin cambios)
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 4. Modificamos handleSubmit para despachar la acción de Redux
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Aquí puedes mantener tus validaciones de formulario si quieres...
        let nuevosErrores = {};
        if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
        if (!formData.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio";
        setErrores(nuevosErrores);
        
        if (Object.keys(nuevosErrores).length > 0) {
            return;
        }

        // Despachamos la acción y esperamos el resultado
        const resultAction = await dispatch(updateUser({ id: usuarioActual.id_usuario, userData: formData }));

        // Verificamos si la acción se completó con éxito
        if (updateUser.fulfilled.match(resultAction)) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu perfil ha sido actualizado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            navigate("/perfil");
        } else {
            // Si falló, el error se obtiene del payload de la acción rechazada
            Swal.fire({
                title: 'Error',
                text: resultAction.payload || 'No se pudieron guardar los cambios.',
                icon: 'error',
            });
        }
    };

    const getInputClassName = (campo) => {
        return coloresCampos[campo] === 'purple' ? 'input-purple' : 'input-gray';
    };

    if (!usuarioActual) {
        return <div className="EditProfile-page"><h1>Cargando perfil...</h1></div>;
    }

    return (
        <div className="EditProfile-page">
            <Sidebar/>
            <div className='edit-wrapper'>
                <div className='titulo'>
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
                                <label htmlFor="dni">DNI</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="dni"
                                        name="dni"
                                        placeholder="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        disabled={!camposEditables.dni}
                                        required
                                        className={getInputClassName('dni')}
                                    />
                                    {camposEditables.DNI ? (
                                            <IoSaveOutline
                                                className="logo"
                                                onClick={() => toggleEdicion('dni')}
                                            />
                                        ) : (
                                            <LiaEditSolid
                                                className="logo"
                                                onClick={() => toggleEdicion('dni')}
                                            />
                                        )}
                                </div>
                                <p className={`error ${errores.dni ? "active" : ""}`}>
                                    {errores.dni}
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
                                <label htmlFor="provincia">Provincia</label>
                                <div className="input-container">
                                    <select
                                        id="provincia"
                                        name="provincia"
                                        value={formData.provincia}
                                        onChange={handleChange}
                                        disabled={!camposEditables.provincia}
                                        required
                                        className={getInputClassName('provincia')}
                                    >
                                        <option value="">Selecciona una provincia</option>
                                        {provinciasArgentinas.map((provincia, index) => (
                                            <option key={index} value={provincia}>
                                                {provincia}
                                            </option>
                                        ))}
                                    </select>
                                    {camposEditables.provincia ? (
                                            <IoSaveOutline
                                                className="logo"
                                                onClick={() => toggleEdicion('provincia')}
                                            />
                                        ) : (
                                            <LiaEditSolid
                                                className="logo"
                                                onClick={() => toggleEdicion('provincia')}
                                            />
                                        )}                            
                                </div>
                                <p className={`error ${errores.provincia ? "active" : ""}`}>
                                    {errores.provincia}
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
                                <label htmlFor="nombre_usuario">Nombre de Usuario</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="nombre_usuario"
                                        name="nombre_usuario"
                                        placeholder="Nombre de Usuario"
                                        value={formData.nombre_usuario}
                                        onChange={handleChange}
                                        disabled={!camposEditables.nombre_usuario}
                                        required
                                        className={getInputClassName('nombre_usuario')}
                                    />
                                    {camposEditables.nombre_usuario ? (
                                            <IoSaveOutline
                                                className="logo"
                                                onClick={() => toggleEdicion('nombre_usuario')}
                                            />
                                        ) : (
                                            <LiaEditSolid
                                                className="logo"
                                                onClick={() => toggleEdicion('nombre_usuario')}
                                            />
                                        )} 
                                </div>
                                <p className={`error ${errores.nombre_usuario ? "active" : ""}`}>
                                    {errores.nombre_usuario}
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

            </div>
        </div>
    );
};

export default EditarPerfil;