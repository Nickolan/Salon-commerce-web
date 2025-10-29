import React from 'react';
import { useNavigate } from "react-router-dom";
import { FiEdit, FiXCircle, FiUsers, FiMapPin, FiDollarSign, FiEyeOff, FiEye } from "react-icons/fi";
import './ItemMiSalon.css'; // Crearemos este archivo de estilos a continuación
import Swal from 'sweetalert2';
import axios from 'axios';
import { deleteSalon, updateSalonStatusAdmin } from '../../store/features/salones/salonSlice';
import { useDispatch } from 'react-redux';

const SalonStatus = {
    OCULTA: 'oculta',
    BORRADOR: 'borrador',
    APROBADA: 'aprobada',
    RECHAZADA: 'rechazada'
};

const ItemMiSalon = ({ salon, onHide }) => {

    const dispatch = useDispatch()
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
        navigate(`/editar-salon/${salon.id_salon}`); // Navega a la nueva ruta
    };

    // Llama a la función onCancelar pasada por props

    const handleCancelar = (id) => { //
        // 2. Usar Swal para confirmar
        Swal.fire({ //
            title: '¿Estás seguro?', //
            text: "¡No podrás revertir esto!", //
            icon: 'warning', //
            showCancelButton: true, //
            confirmButtonColor: '#d33', // Color rojo para confirmar eliminación
            cancelButtonColor: '#3085d6', // Color azul para cancelar
            confirmButtonText: 'Sí, ¡eliminarlo!', //
            cancelButtonText: 'Cancelar' //
        }).then((result) => { //
            // 3. Si el usuario confirma...
            if (result.isConfirmed) { //
                // 4. Despachar el thunk deleteSalon
                dispatch(deleteSalon(id)) //
                    .unwrap() // <-- .unwrap() para manejar la promesa del thunk
                    .then(() => { //
                        // 5. Mostrar mensaje de éxito si se cumple
                        Swal.fire( //
                            '¡Eliminado!', //
                            'Tu salón ha sido eliminado.', //
                            'success' //
                        );
                        // No necesitas recargar explícitamente, Redux actualizará el estado y re-renderizará
                    })
                    .catch((err) => { //
                        // 6. Mostrar mensaje de error si falla
                        Swal.fire( //
                            'Error', //
                            `No se pudo eliminar el salón: ${err || 'Error desconocido'}`, // Mostrar error del rejectWithValue
                            'error' //
                        );
                    });
            }
        });
    };

    const handleHideClick = (e) => {
        e.stopPropagation();
        if (onHide) { // Verifica que la prop exista

            onHide(salon.id_salon);
        } else {
            console.error("La función onHide no fue proporcionada a ItemMiSalon");
        }
    };

    const handleHideSalon = (e) => {
        e.stopPropagation()
        console.log(salon.id_salon);

        Swal.fire({
            title: '¿Ocultar este salón?',
            text: "El salón no será visible en las búsquedas, pero podrás reactivarlo.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ocultar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateSalonStatusAdmin({ salonId: salon.id_salon, nuevoEstado: salon.estado_publicacion == SalonStatus.OCULTA ? SalonStatus.APROBADA : SalonStatus.OCULTA })) // Llama al thunk con el estado 'oculta'
                    .unwrap()
                    .then(() => Swal.fire('Oculto', 'El salón ha sido ocultado.', 'success'))
                    .catch((err) => Swal.fire('Error', `No se pudo ocultar el salón: ${err?.message || 'Error desconocido'}`, 'error'));
            }
        });
    };

    const puedeOcultar = salon.estado_publicacion !== 'oculta';

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
                            <FiUsers className='icono' />
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
                        <button onClick={handleEditClick} aria-label="Editar salón"><FiEdit /></button>
                        <button onClick={() => handleCancelar(salon.id_salon)} aria-label="Eliminar salón"><FiXCircle /></button>
                        {puedeOcultar ? ( // Renderizado condicional
                            <button onClick={handleHideSalon} aria-label="Ocultar salón" title="Ocultar Salón" className="btn-ocultar">
                                <FiEyeOff /> {/* Icono más apropiado */}
                            </button>
                        ) : (
                            <button onClick={handleHideSalon} aria-label="Ocultar salón" title="Ocultar Salón" className="btn-ocultar">
                                <FiEye /> {/* Icono más apropiado */}
                            </button>
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemMiSalon;