import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/Perfil.css";
import usuariosData from "../utils/Usuarios.json";
import { LiaEditSolid } from "react-icons/lia";
import Sidebar from '../components/Sidebar/Sidebar';

const Perfil = () => {
    const navigate = useNavigate();
    const usuario = usuariosData[0];

    const handleEditarClick = () => {
        navigate("/editar-perfil");
    };

    if (!usuario) {
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
                    <span className="nombre_de_usuario">
                        {usuario.nombre} {usuario.apellido}
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
                            <h3>{usuario.nombre} {usuario.apellido}</h3>
                        </div>
                        <div>
                            <label>DNI</label>
                            <h3>{usuario.dni}</h3>
                        </div>
                        <div>
                            <label>Ciudad</label>
                            <h3>{usuario.ciudad}</h3>
                        </div>
                        <div>
                            <label>Provincia</label>
                            <h3>{usuario.provincia}</h3>
                        </div>
                    </div>
                    <div className='Right-container'>
                        <h2>Datos de la Cuenta</h2>
                        <div>
                            <label>Correo Electrónico</label>
                            <h3>{usuario.email}</h3>
                        </div>
                        <div>
                            <label>Teléfono</label>
                            <h3>{usuario.telefono}</h3>
                        </div>
                        <div>
                            <label>Nombre de Usuario</label>
                            <h3>{usuario.nombre_usuario}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
