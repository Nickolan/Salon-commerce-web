// src/screens/EditarPerfil.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, uploadProfilePic } from '../store/features/auth/authSlice'; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2';
import { StandaloneSearchBox } from "@react-google-maps/api";
import "../styles/EditarPerfil.css"; // Asegúrate que la ruta sea correcta
import { LiaEditSolid } from "react-icons/lia";
import { IoSaveOutline } from "react-icons/io5";
import Sidebar from '../Components/Sidebar/Sidebar';
import { FaCamera, FaMapMarkerAlt } from 'react-icons/fa';

const EditarPerfil = ({ isLoaded }) => { // Asegúrate de recibir isLoaded si lo usas con Google Maps API
    const { user: usuarioActual, status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(usuarioActual);
    

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        ciudad: '',
        provincia: '',
        telefono: '',
        nombre_usuario: '',
        latitud: null,
        longitud: null,
        ubicacion: ""
    });

    const [direccionInput, setDireccionInput] = useState("");
    const [camposEditables, setCamposEditables] = useState({});
    const [errores, setErrores] = useState({}); // Asegúrate de implementar la lógica de errores si es necesaria

    // --- CORRECCIÓN AQUÍ ---
    const [coloresCampos, setColoresCampos] = useState({
        nombre: 'gray',
        apellido: 'gray',
        dni: 'gray',
        ciudad: 'gray',
        provincia: 'gray',
        telefono: 'gray',
        nombre_usuario: 'gray', // Generalmente no editable
        ubicacion: 'gray' // Inicializar 'ubicacion'
    });
    // --- FIN CORRECCIÓN ---

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const inputAutocompleteRef = useRef();

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
                latitud: usuarioActual.latitud || null,
                longitud: usuarioActual.longitud || null,
            });
            // Inicializar direccionInput basado en datos existentes si es posible
            if (usuarioActual.ciudad || usuarioActual.provincia) {
                 // Podrías intentar reconstruir una dirección o dejarla vacía
                 // setDireccionInput(`${usuarioActual.ciudad || ''}, ${usuarioActual.provincia || ''}`);
                 // O simplemente mostrar ciudad/provincia en sus campos si los mantienes
            } else if (usuarioActual.latitud && usuarioActual.longitud) {
                // Idealmente Geocoding inverso aquí para obtener la dirección
                setDireccionInput(`Lat: ${usuarioActual.latitud}, Lng: ${usuarioActual.longitud}`); // Placeholder
            } else {
                setDireccionInput("");
            }
        }
    }, [usuarioActual]);

    const handlePlaceChanged = () => {
        if (!inputAutocompleteRef.current) return;
        const places = inputAutocompleteRef.current.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];

        if (place && place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            console.log(lat, lng);
            
            const direccionFormateada = place.formatted_address || "";

            setDireccionInput(direccionFormateada);

            setFormData(prev => ({
                ...prev,
                latitud: lat,
                longitud: lng,
                // Opcional: auto-rellenar ciudad/provincia
                ciudad: place.address_components?.find(c => c.types.includes('locality'))?.long_name || prev.ciudad,
                provincia: place.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name || prev.provincia,
            }));

            setCamposEditables(prev => ({ ...prev, ubicacion: true }));
            setColoresCampos(prev => ({ ...prev, ubicacion: 'purple' })); // Cambiar a 'purple' al editar
        }
    };

    const toggleEdicion = (campo) => {
        const estaEditando = !camposEditables[campo];
        setCamposEditables(prev => ({ ...prev, [campo]: estaEditando }));
        // Si deja de editar (hace clic en guardar), vuelve a gris, sino a púrpura
        setColoresCampos(prev => ({ ...prev, [campo]: estaEditando ? 'purple' : 'gray' }));
        // Si deja de editar el campo 'ubicacion' y no hay lat/lng, resetea el input visual
        if (campo === 'ubicacion' && !estaEditando && (!formData.latitud || !formData.longitud)) {
             setDireccionInput("");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrores({}); // Limpia errores

        const datosParaActualizar = {};
        let huboCambios = false; // Flag para saber si hay algo que guardar

        // Itera sobre los campos editables marcados
        Object.keys(camposEditables).forEach(campo => {
            if (camposEditables[campo]) { // Si este campo estaba siendo editado
                if (campo === 'ubicacion') {
                    // Manejo especial para ubicación (lat/lng)
                    console.log("Manejo especial para ubicacion");
                    
                    if (formData.latitud !== usuarioActual.latitud || formData.longitud !== usuarioActual.longitud) {
                        console.log("Modificando datos");
                        
                        datosParaActualizar.latitud = formData.latitud;
                        datosParaActualizar.longitud = formData.longitud;
                         // Si la ubicación cambió, también incluimos ciudad y provincia
                        datosParaActualizar.ciudad = formData.ciudad || null; // Enviar null si está vacío
                        datosParaActualizar.provincia = formData.provincia || null;
                        huboCambios = true;
                    } else {
                        console.log("No se modifico por x o y razon");
                        
                    }
                } else if (formData[campo] !== usuarioActual[campo]) {
                    // Para otros campos, solo incluir si el valor cambió
                    datosParaActualizar[campo] = formData[campo] === '' ? null : formData[campo]; // Enviar null si se vació un campo opcional
                    huboCambios = true;
                }
            }
        });

        // Caso especial si solo se modificó ciudad o provincia sin tocar ubicación
        if (camposEditables.ciudad && !camposEditables.ubicacion && formData.ciudad !== usuarioActual.ciudad) {
            datosParaActualizar.ciudad = formData.ciudad || null;
            huboCambios = true;
        }
         if (camposEditables.provincia && !camposEditables.ubicacion && formData.provincia !== usuarioActual.provincia) {
            datosParaActualizar.provincia = formData.provincia || null;
            huboCambios = true;
        }


        // --- CORRECCIÓN EN LA LÓGICA DE GUARDADO ---
        if (!huboCambios) { // Usar el flag huboCambios en lugar de Object.keys
            Swal.fire('Información', 'No hay cambios para guardar.', 'info');
            // Opcional: resetear los colores a gris si no hay cambios
             const resetColoresCampos = { ...coloresCampos };
             Object.keys(resetColoresCampos).forEach(key => {
                  if (camposEditables[key]) resetColoresCampos[key] = 'gray'; // Volver a gris solo los que se intentaron editar
             });
             setColoresCampos(resetColoresCampos);
             setCamposEditables({}); // Limpiar campos editables

            return; // Detener si no hay nada que guardar
        }
        // --- FIN CORRECCIÓN ---


        console.log("Datos a enviar:", datosParaActualizar); // <-- Log para depuración

        const resultAction = await dispatch(updateUser({
            id: usuarioActual.id_usuario,
            userData: datosParaActualizar // Envía solo los datos modificados
        }));

        if (updateUser.fulfilled.match(resultAction)) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu perfil ha sido actualizado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            // Resetea los campos editables a 'false' y colores a 'gray' después de guardar exitosamente
            const resetCamposEditables = {};
            const resetColoresCampos = { ...coloresCampos }; // Copia estado actual
            Object.keys(camposEditables).forEach(key => {
                 if (camposEditables[key]) { // Solo resetea los que se guardaron
                     resetCamposEditables[key] = false;
                     resetColoresCampos[key] = 'gray';
                 }
            });
             // Asegurarse de que los no editables sigan en gris
             resetColoresCampos.nombre_usuario = 'gray';
             // resetColoresCampos.email = 'gray';

            setCamposEditables(resetCamposEditables);
            setColoresCampos(resetColoresCampos);

            // navigate("/perfil"); // Descomentar si quieres redirigir
        } else {
            Swal.fire({
                title: 'Error',
                // Mostrar el mensaje específico del backend si existe
                text: resultAction.payload?.message || resultAction.payload || 'No se pudieron guardar los cambios.',
                icon: 'error',
            });
            console.error("Error al actualizar:", resultAction.payload); // Log del error
        }
    };

    const getInputClassName = (campo) => {
        // Asegúrate que coloresCampos[campo] siempre exista
        return coloresCampos[campo] === 'purple' ? 'input-purple' : 'input-gray';
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataApi = new FormData(); // Renombrar para evitar conflicto con formData del estado
        formDataApi.append('file', file);
        const resultAction = await dispatch(uploadProfilePic(formDataApi));
        setUploading(false);
        if (uploadProfilePic.fulfilled.match(resultAction)) {
            Swal.fire('¡Éxito!', 'Foto de perfil actualizada.', 'success');
        } else {
            Swal.fire('Error', resultAction.payload || 'No se pudo subir la imagen.', 'error');
        }
        // Limpiar el input para permitir subir la misma imagen de nuevo si falla
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
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
                    <div className="profile-pic-container">
                        <img
                            src={usuarioActual.foto_perfil || "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"}
                            alt="Foto de perfil"
                            className="profile-pic"
                            onClick={handleImageClick} // Permitir clic en la imagen
                            style={{ cursor: 'pointer' }} // Indicar que es clickeable
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp" // Aceptar webp
                            style={{ display: 'none' }}
                        />
                         <button
                            className="edit-pic-button"
                            onClick={handleImageClick}
                            disabled={uploading}
                            type="button" // Evitar que envíe el formulario
                        >
                            {uploading ? <div className="spinner-small"></div> : <FaCamera />}
                        </button>
                    </div>
                </div>
                <div className="containers-wrapper">
                    {/* Contenedor Izquierdo */}
                    <div className="Left-container">
                        {/* Usamos un solo form para todo */}
                        <form className="registro-form" onSubmit={handleSubmit} noValidate>
                            {/* Nombre */}
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        className={getInputClassName('nombre')}
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        disabled={!camposEditables.nombre}
                                    />
                                    {camposEditables.nombre ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('nombre')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('nombre')} />
                                    )}
                                </div>
                                {errores.nombre && <p className="error-mensaje">{errores.nombre}</p>}
                            </div>

                            {/* Apellido */}
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="apellido"
                                        name="apellido"
                                        className={getInputClassName('apellido')}
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        disabled={!camposEditables.apellido}
                                    />
                                    {camposEditables.apellido ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('apellido')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('apellido')} />
                                    )}
                                </div>
                                {errores.apellido && <p className="error-mensaje">{errores.apellido}</p>}
                            </div>

                             {/* DNI */}
                             <div className="form-group">
                                <label htmlFor="dni">DNI</label>
                                <div className="input-container">
                                    <input
                                        type="text" // Usar text para permitir borrar completamente
                                        id="dni"
                                        name="dni"
                                        className={getInputClassName('dni')}
                                        value={formData.dni}
                                        onChange={handleChange}
                                        disabled={!camposEditables.dni}
                                        inputMode="numeric" // Sugiere teclado numérico en móviles
                                        pattern="\d*" // Acepta solo dígitos (HTML5)
                                    />
                                    {camposEditables.dni ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('dni')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('dni')} />
                                    )}
                                </div>
                                {errores.dni && <p className="error-mensaje">{errores.dni}</p>}
                            </div>

                            {/* Campo de Ubicación (Autocomplete) */}
                            <div className="form-group">
                                <label htmlFor="ubicacion">Ubicación (para salones cercanos)</label>
                                <div className="input-container">
                                   {isLoaded ? ( // Renderizar solo si Google Maps API está cargada
                                        <StandaloneSearchBox
                                            onLoad={(ref) => (inputAutocompleteRef.current = ref)}
                                            onPlacesChanged={handlePlaceChanged}
                                            options={{
                                                componentRestrictions: { country: "ar" },
                                                fields: ["formatted_address", "geometry"],
                                                types: ["geocode"],
                                            }}
                                        >
                                            <input
                                                type="text"
                                                id="ubicacion" // Añadir ID para el label
                                                name="ubicacion" // Puede ser útil, aunque no se envíe directamente
                                                className={getInputClassName('ubicacion') + ' autocomplete-input'} // Añadir clase
                                                placeholder="Ingresa tu dirección"
                                                value={direccionInput}
                                                onChange={(e) => {
                                                    setDireccionInput(e.target.value);
                                                    // Si el usuario borra manualmente, resetea lat/lng
                                                    if (e.target.value === '') {
                                                        setFormData(prev => ({...prev, latitud: null, longitud: null}));
                                                    }
                                                }}
                                                disabled={!camposEditables.ubicacion}
                                                // No pongas ref aquí, ya está en StandaloneSearchBox
                                            />
                                        </StandaloneSearchBox>
                                    ) : (
                                        <input
                                            type="text"
                                            id="ubicacion"
                                            name="ubicacion"
                                            className={getInputClassName('ubicacion')}
                                            placeholder="Cargando mapa..."
                                            value={direccionInput}
                                            disabled={true}
                                        />
                                    )}
                                    <FaMapMarkerAlt className="logo-mapa" />
                                    {camposEditables.ubicacion ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('ubicacion')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('ubicacion')} />
                                    )}
                                </div>
                                {/* Mostrar coordenadas (opcional, para debug o info) */}
                                <p className="info-ubicacion">
                                    {formData.latitud && formData.longitud
                                      ? `Lat: ${formData.latitud.toFixed(4)}, Lng: ${formData.longitud.toFixed(4)}`
                                      : 'Ubicación no establecida'
                                    }
                                </p>
                            </div>

                            {/* Ciudad (Opcional si usas Autocomplete para rellenar) */}
                            <div className="form-group">
                                <label htmlFor="ciudad">Ciudad</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="ciudad"
                                        name="ciudad"
                                        className={getInputClassName('ciudad')}
                                        value={formData.ciudad}
                                        onChange={handleChange}
                                        disabled={!camposEditables.ciudad}
                                    />
                                     {camposEditables.ciudad ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('ciudad')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('ciudad')} />
                                    )}
                                </div>
                                {errores.ciudad && <p className="error-mensaje">{errores.ciudad}</p>}
                            </div>

                            {/* Provincia (Opcional si usas Autocomplete para rellenar) */}
                             <div className="form-group">
                                <label htmlFor="provincia">Provincia</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="provincia"
                                        name="provincia"
                                        className={getInputClassName('provincia')}
                                        value={formData.provincia}
                                        onChange={handleChange}
                                        disabled={!camposEditables.provincia}
                                    />
                                    {camposEditables.provincia ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('provincia')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('provincia')} />
                                    )}
                                </div>
                                {errores.provincia && <p className="error-mensaje">{errores.provincia}</p>}
                            </div>

                             {/* Botón de Guardar Cambios (ahora dentro del form) */}
                             <div className="form-group btn-guardar-container">
                                <button type="submit" className="btn-guardar-div" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form> {/* Cierre del form del contenedor izquierdo */}
                    </div>

                     {/* Contenedor Derecho (solo con los campos restantes) */}
                    <div className="Right-container">
                         {/* Usamos el mismo form, solo con los campos restantes */}
                        <form className="registro-form" onSubmit={handleSubmit} noValidate>
                            {/* Teléfono */}
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono</label>
                                <div className="input-container">
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        className={getInputClassName('telefono')}
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        disabled={!camposEditables.telefono}
                                    />
                                    {camposEditables.telefono ? (
                                        <IoSaveOutline className="logo" onClick={() => toggleEdicion('telefono')} />
                                    ) : (
                                        <LiaEditSolid className="logo" onClick={() => toggleEdicion('telefono')} />
                                    )}
                                </div>
                                {errores.telefono && <p className="error-mensaje">{errores.telefono}</p>}
                            </div>

                            {/* Nombre de Usuario */}
                            <div className="form-group">
                                <label htmlFor="nombre_usuario">Nombre de Usuario</label>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        id="nombre_usuario"
                                        name="nombre_usuario"
                                        className={getInputClassName('nombre_usuario')}
                                        value={formData.nombre_usuario}
                                        onChange={handleChange}
                                        disabled={true} // Generalmente no se permite cambiar el nombre de usuario
                                    />
                                    {/* Opcional: Icono deshabilitado o sin icono */}
                                </div>
                                {errores.nombre_usuario && <p className="error-mensaje">{errores.nombre_usuario}</p>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="input-gray" // El email no se edita aquí usualmente
                                        value={usuarioActual.email} // Mostrar el email actual
                                        disabled={true} // Deshabilitado
                                    />
                                    {/* Opcional: Sin icono de edición */}
                                </div>
                            </div>
                            
                            {/* Repetir el botón aquí NO es necesario si usamos un solo <form> */}
                            {/* <div className="form-group">
                                <div className="btn-guardar-div" onClick={handleSubmit}>
                                    {status === 'loading' ? 'Guardando...' : 'Guardar Cambios'}
                                </div>
                            </div> */}
                        </form> {/* Cierre del form del contenedor derecho */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfil;