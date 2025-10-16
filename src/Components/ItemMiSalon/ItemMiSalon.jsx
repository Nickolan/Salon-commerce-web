import React from 'react';
import { useNavigate } from "react-router-dom";
import { FiEdit, FiXCircle, FiUsers, FiMapPin, FiDollarSign } from "react-icons/fi";
import './ItemMiSalon.css'; // Crearemos este archivo de estilos a continuación

const ItemMiSalon = ({ salon, onCancelar }) => {
    const navigate = useNavigate();

    // Navega al detalle del salón
    const handleCardClick = () => {
        navigate(`/salon/${salon.id_salon}`);
    };

    // Evita que el clic en los botones propague el evento al contenedor principal
    const handleButtonClick = (e) => {
        e.stopPropagation();
    };
    
    // Navega a la página de edición
    const handleEditClick = (e) => {
        e.stopPropagation();
        navigate(`/editar-salon/${salon.id_salon}`);
    };

    // Llama a la función onCancelar pasada por props
    const handleCancelClick = (e) => {
        e.stopPropagation();
        onCancelar(salon.id_salon);
    };

    return (
        <div className='card-salon' onClick={handleCardClick}>
            <div className='card-imagen-wrapper'>
                <img 
                    src={salon.fotos && salon.fotos.length > 0 ? salon.fotos[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsqEx41lmw6yMNksFVU2dPXYqdciHh9CaGlw&s"} 
                    alt={salon.nombre} 
                    className='card-imagen' 
                />
            </div>
            <div className='card-contenido'>
                <div className='card-izquierda'>
                    <p className='salon-nombre'>{salon.nombre}</p>
                    <p className='salon-caracteristica'>
                        <FiMapPin className='icono' />
                        {salon.direccion}
                    </p>
                    <div className='caracteristicas-secundarias'>
                        <span className='salon-caracteristica'>
                            <FiUsers className='icono'/>
                            {salon.capacidad} personas
                        </span>
                        <span className='salon-caracteristica'>
                            <FiDollarSign className='icono' />
                            {salon.precio_por_hora} por hora
                        </span>
                    </div>
                </div>
                <div className='card-derecha'>
                    <div className='estado-publicacion'>
                        <span className={`estado-tag estado-${salon.estado_publicacion}`}>
                            {salon.estado_publicacion}
                        </span>
                    </div>
                    <div className='botones' onClick={handleButtonClick}>
                        <button onClick={handleEditClick} aria-label="Editar salón"><FiEdit/></button>
                        <button onClick={handleCancelClick} aria-label="Eliminar salón"><FiXCircle/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemMiSalon;