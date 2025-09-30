import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/Perfil.css";
import LautaroLogo from "../assets/img/Lautaro-logo.png";
import usuariosData from "../utils/Usuarios.json";
import { LiaEditSolid } from "react-icons/lia";

const Perfil = () => {
    const navigate = useNavigate();
    const getUsuarioActual = () => {
        try {
            const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosData'));
            if (usuariosGuardados) {
                return usuariosGuardados.find(u => u.id_usuario === 4);
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
        return usuariosData.find(u => u.id_usuario === 4);
    };

    const usuario = getUsuarioActual();

    const handleEditarClick = () => {
        navigate("/editar");
    };

    if (!usuario) {
        return (
            <div className='Profile-page'>
                <h1>Error: Usuario no encontrado</h1>
            </div>
        );
    }

    return (
        <div className='Profile-page'>
            <span className="nombre_de_usuario">
                <img src={LautaroLogo} className='logo' alt="logo" />
                {usuario.nombre} {usuario.apellido}
                <div className="editar-button" onClick={handleEditarClick}>
                    <LiaEditSolid className='logo-editar' /> {/* Ícono de edición */}
                    <span className="editar-texto">Editar</span>
                </div>
            </span>
            <div className='containers-wrapper'>
                <div className='Left-container'>
                    <h2>Información Personal</h2>
                    <div>
                        <label htmlFor="nombre">Nombre Completo</label>
                        <h3>{usuario.nombre} {usuario.apellido}</h3>
                    </div>
                    <div>
                        <label htmlFor="dni">DNI</label>
                        <h3>{usuario.dni}</h3>
                    </div>
                    <div>
                        <label htmlFor="ciudad">Ciudad</label>
                        <h3>{usuario.ciudad}</h3>
                    </div>
                    <div>
                        <label htmlFor="provincia">Provincia</label>
                        <h3>{usuario.provincia}</h3>
                    </div>
                </div>
                <div className='Right-container'>
                    <h2>Datos de la Cuenta</h2>
                    <div>
                        <label htmlFor="email">Correo Electrónico</label>
                        <h3>{usuario.email}</h3>
                    </div>
                    <div>
                        <label htmlFor="telefono">Teléfono</label>
                        <h3>{usuario.telefono}</h3>
                    </div>
                    <div>
                        <label htmlFor="nombre_usuario">Nombre de Usuario</label>
                        <h3>{usuario.nombre_usuario}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;