import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, uploadProfilePic } from '../store/features/auth/authSlice';
import Swal from 'sweetalert2';
import { StandaloneSearchBox } from "@react-google-maps/api";
import "../styles/EditarPerfil.css";
import { CiCamera } from "react-icons/ci";
import { FaMapMarkerAlt } from 'react-icons/fa';
import Sidebar from '../Components/Sidebar/Sidebar';

const EditarPerfil = ({ isLoaded }) => {
    const { user: usuarioActual, status } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        email: ''
    });

    const [direccionInput, setDireccionInput] = useState("");
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
                email: usuarioActual.email || ""
            });

            // Inicializar direccionInput si hay latitud/longitud
            if (usuarioActual.ciudad && usuarioActual.provincia) {
                setDireccionInput(`${usuarioActual.ciudad}, ${usuarioActual.provincia}`);
            }
        }
    }, [usuarioActual]);

    // Función para formatear la fecha
    const formatFechaRegistro = (fecha) => {
        if (!fecha) return 'Usuario Registrado desde 2025';
        const año = new Date(fecha).getFullYear();
        return `Usuario Registrado desde ${año}`;
    };

    const handlePlaceChanged = () => {
        if (!inputAutocompleteRef.current) return;
        const places = inputAutocompleteRef.current.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];

        if (place && place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            const direccionFormateada = place.formatted_address || "";

            setDireccionInput(direccionFormateada);

            setFormData(prev => ({
                ...prev,
                latitud: lat,
                longitud: lng,
                ciudad: place.address_components?.find(c => c.types.includes('locality'))?.long_name || prev.ciudad,
                provincia: place.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name || prev.provincia,
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    const datosParaActualizar = {};
    let huboCambios = false;

    // Comparar cada campo con el valor original
    Object.keys(formData).forEach(campo => {
        // Incluimos email y nombre_usuario ahora
        if (formData[campo] !== usuarioActual[campo]) {
        if (campo === 'dni' || campo === 'ciudad' || campo === 'provincia' || campo === 'telefono') {
            datosParaActualizar[campo] = formData[campo] === '' ? null : formData[campo];
        } else {
            datosParaActualizar[campo] = formData[campo];
        }
        huboCambios = true;
        }
    });

    // Verificar cambios en ubicación
    if (formData.latitud !== usuarioActual.latitud || formData.longitud !== usuarioActual.longitud) {
        datosParaActualizar.latitud = formData.latitud;
        datosParaActualizar.longitud = formData.longitud;
        huboCambios = true;
    }

    if (!huboCambios) {
        Swal.fire('Información', 'No hay cambios para guardar.', 'info');
        return;
    }

    console.log('Datos a enviar:', datosParaActualizar); // Para debugging

    const resultAction = await dispatch(updateUser({
        id: usuarioActual.id_usuario,
        userData: datosParaActualizar
    }));

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
        Swal.fire({
        title: 'Error',
        text: resultAction.payload?.message || 'No se pudieron guardar los cambios.',
        icon: 'error',
        });
    }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataApi = new FormData();
        formDataApi.append('file', file);
        const resultAction = await dispatch(uploadProfilePic(formDataApi));
        setUploading(false);
        if (uploadProfilePic.fulfilled.match(resultAction)) {
            Swal.fire('¡Éxito!', 'Foto de perfil actualizada.', 'success');
        } else {
            Swal.fire('Error', resultAction.payload || 'No se pudo subir la imagen.', 'error');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCancelar = () => {
        navigate("/perfil");
    };

    if (!usuarioActual) {
        return <div className="edit-profile-wrapper"><h1>Cargando perfil...</h1></div>;
    }

    return (
        <div className='edit-profile-wrapper'>
            <Sidebar/> 
            
            <main className='edit-profile-content'>
                {/* Header Card - similar a Perfil pero con overlay y botones diferentes */}
                <div className='edit-profile-header-card'>
                    <div className='edit-profile-header-content'>
                        <div className="edit-profile-pic-container" onClick={handleImageClick}>
                            <img 
                                src={usuarioActual.foto_perfil || "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"} 
                                alt="Perfil" 
                                className="edit-profile-page-pic"
                            />
                            <div className="edit-profile-pic-overlay">
                                <CiCamera className="edit-profile-camera-icon" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/webp"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className='edit-profile-name-section'>
                            <h1 className="edit-profile-user-name">
                                {usuarioActual.nombre} {usuarioActual.apellido}
                            </h1>
                            <p className="edit-profile-register-date">
                                {formatFechaRegistro(usuarioActual.fecha_creacion)}
                            </p>
                        </div>
                        <div className='edit-profile-buttons-container'>
                            <div className="edit-profile-cancel-button" onClick={handleCancelar}>
                                <span className="edit-profile-cancel-text">CANCELAR</span>
                            </div>
                            <div className="edit-profile-save-button" onClick={handleSubmit}>
                                <span className="edit-profile-save-text">GUARDAR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Formulario de edición */}
                <form onSubmit={handleSubmit}>
                    <div className='edit-profile-cards-grid'>
                        {/* Container Izquierdo - Información Personal */}
                        <div className='edit-profile-info-card'>
                            <h2 className="edit-profile-card-title">Información Personal</h2>
                            
                            {/* Campo Nombre y Apellido (dividido en dos) */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Nombre Completo</label>
                                <div className="edit-profile-name-fields">
                                    <div className="edit-profile-input-wrapper">
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder={!formData.nombre ? "Nombre" : ""}
                                            className="edit-profile-input"
                                        />
                                    </div>
                                    <div className="edit-profile-input-wrapper">
                                        <input
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            placeholder={!formData.apellido ? "Apellido" : ""}
                                            className="edit-profile-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Campo Número de Documento */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Número de Documento</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="text"
                                        name="dni"
                                        value={formData.dni || ''}
                                        onChange={handleChange}
                                        placeholder={!formData.dni ? "Añadir Número de Documento" : ""}
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Ciudad */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Ciudad</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="text"
                                        name="ciudad"
                                        value={formData.ciudad || ''}
                                        onChange={handleChange}
                                        placeholder={!formData.ciudad ? "Añadir ciudad" : ""}
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Provincia */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Provincia</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="text"
                                        name="provincia"
                                        value={formData.provincia || ''}
                                        onChange={handleChange}
                                        placeholder={!formData.provincia ? "Añadir provincia" : ""}
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Container Derecho - Datos de la Cuenta */}
                        <div className='edit-profile-info-card'>
                            <h2 className="edit-profile-card-title">Datos de la Cuenta</h2>
                            
                            {/* Campo Correo Electrónico (ahora editable visualmente) */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Correo Electrónico</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Correo electrónico"
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Teléfono */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Número de Teléfono</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono || ''}
                                        onChange={handleChange}
                                        placeholder={!formData.telefono ? "Añadir teléfono" : ""}
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Nombre de Usuario (ahora editable visualmente) */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Nombre de Usuario</label>
                                <div className="edit-profile-input-wrapper">
                                    <input
                                        type="text"
                                        name="nombre_usuario"
                                        value={formData.nombre_usuario}
                                        onChange={handleChange}
                                        placeholder="Nombre de usuario"
                                        className="edit-profile-input"
                                    />
                                </div>
                            </div>

                            {/* Campo Ubicación (para salones cercanos) con icono de mapa */}
                            <div className="edit-profile-field">
                                <label className="edit-profile-field-label">Ubicación (para salones cercanos)</label>
                                <div className="edit-profile-input-wrapper with-icon">
                                    <FaMapMarkerAlt className="edit-profile-map-icon" />
                                    {isLoaded ? (
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
                                                className="edit-profile-input with-icon"
                                                placeholder="Ingresa tu ubicación"
                                                value={direccionInput}
                                                onChange={(e) => {
                                                    setDireccionInput(e.target.value);
                                                    if (e.target.value === '') {
                                                        setFormData(prev => ({...prev, latitud: null, longitud: null}));
                                                    }
                                                }}
                                            />
                                        </StandaloneSearchBox>
                                    ) : (
                                        <input
                                            type="text"
                                            className="edit-profile-input with-icon"
                                            placeholder="Cargando mapa..."
                                            value={direccionInput}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditarPerfil;