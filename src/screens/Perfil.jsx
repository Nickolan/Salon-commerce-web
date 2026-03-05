import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/Perfil.css";
import { LiaEditSolid } from "react-icons/lia";
import { IoAddOutline } from "react-icons/io5";
import Sidebar from '../Components/Sidebar/Sidebar';
import { useSelector } from 'react-redux';

const Perfil = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleEditarClick = () => {
        navigate("/editar-perfil");
    };

    // Función para formatear la fecha
    const formatFechaRegistro = (fecha) => {
        if (!fecha) return 'Usuario Registrado desde 2025';
        const año = new Date(fecha).getFullYear();
        return `Usuario Registrado desde ${año}`;
    };

    // Función para renderizar campos que pueden ser null
    const renderNullableField = (fieldValue, fieldName) => {
        if (fieldValue && fieldValue.trim() !== '') {
            return <span className="perfil-not-null-data">{fieldValue}</span>;
        } else {
            return (
                <div className="perfil-null-data">
                    <IoAddOutline className="add-icon" />
                    <span>Añadir {fieldName}</span>
                </div>
            );
        }
    };

    if (!user) {
        return (
            <div className='profile-wrapper'>
                <h1>Error: Usuario no encontrado</h1>
            </div>
        );
    }

    return (
        <div className='profile-wrapper'>
            <Sidebar/> 
            
            <main className='profile-content'>
                {/* Primer Container - Foto y nombre */}
                <div className='profile-header-card'>
                    <div className='profile-header-content'>
                        <img 
                            src={user.foto_perfil || "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"} 
                            alt="Perfil" 
                            className="profile-page-pic"
                        />
                        <div className='profile-name-section'>
                            <h1 className="profile-user-name">
                                {user.nombre} {user.apellido}
                            </h1>
                            <p className="profile-register-date">
                                {formatFechaRegistro(user.fecha_creacion)}
                            </p>
                        </div>
                        <div className="profile-edit-button" onClick={handleEditarClick}>
                            <LiaEditSolid className='profile-edit-icon' /> 
                            <span className="profile-edit-text">Editar</span>
                        </div>
                    </div>
                </div>

                {/* Containers de Información */}
                <div className='profile-cards-grid'>
                    {/* Container Izquierdo - Información Personal */}
                    <div className='profile-info-card'>
                        <h2 className="profile-card-title">Información Personal</h2>
                        
                        <div className="profile-field">
                            <label className="profile-field-label">Nombre Completo</label>
                            <span className="perfil-not-null-data">
                                {user.nombre} {user.apellido}
                            </span>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Número de Documento</label>
                            {renderNullableField(user.dni, 'Número de Documento')}
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Ciudad</label>
                            {renderNullableField(user.ciudad, 'ciudad')}
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Provincia</label>
                            {renderNullableField(user.provincia, 'provincia')}
                        </div>
                    </div>

                    {/* Container Derecho - Datos de la Cuenta */}
                    <div className='profile-info-card'>
                        <h2 className="profile-card-title">Datos de la Cuenta</h2>
                        
                        <div className="profile-field">
                            <label className="profile-field-label">Correo Electrónico</label>
                            <span className="perfil-not-null-data">{user.email}</span>
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Número de Teléfono</label>
                            {renderNullableField(user.telefono, 'teléfono')}
                        </div>

                        <div className="profile-field">
                            <label className="profile-field-label">Nombre de Usuario</label>
                            <span className="perfil-not-null-data">{user.nombre_usuario}</span>
                        </div>

                        <div className="profile-card-spacer"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Perfil;