import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/Perfil.css";
import usuariosData from "../utils/Usuarios.json";
import { LiaEditSolid } from "react-icons/lia";
import Sidebar from '../components/Sidebar/Sidebar';
import { useSelector } from 'react-redux';

const Perfil = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleEditarClick = () => {
        navigate("/editar-perfil");
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
            
            <div className='profile-content'>
                <div className='titulo'>
                    <img 
                        src={user.foto_perfil || "https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp"} 
                        alt="Perfil" 
                        className="profile-page-pic"
                    />
                    <span className="nombre_de_usuario">
                        {user.nombre} {user.apellido}
                        <div className="editar-button" onClick={handleEditarClick}>
                            <LiaEditSolid className='logo-editar' /> 
                            <span className="editar-texto">Editar</span>
                        </div>
                    </span>
                </div>

                <div className='containers-wrapper'>
                    <div className='Left-container'>
                        <h2>Información Personal</h2>
                        <div>
                            <label>Nombre Completo</label>
                            <h3>{user.nombre} {user.apellido}</h3>
                        </div>
                        <div>
                            <label>DNI</label>
                            <h3>{user.dni}</h3>
                        </div>
                        <div>
                            <label>Ciudad</label>
                            <h3>{user.ciudad}</h3>
                        </div>
                        <div>
                            <label>Provincia</label>
                            <h3>{user.provincia}</h3>
                        </div>
                    </div>
                    <div className='Right-container'>
                        <h2>Datos de la Cuenta</h2>
                        <div>
                            <label>Correo Electrónico</label>
                            <h3>{user.email}</h3>
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <h3>{user.telefono}</h3>
                        </div>
                        <div>
                            <label>Nombre de Usuario</label>
                            <h3>{user.nombre_usuario}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
