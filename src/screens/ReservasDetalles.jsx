import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservaById, clearSelectedReserva, updateReservaStatus, resetReservaStatus } from '../store/features/reservas/reservasSlice';
import Swal from 'sweetalert2'
import { format, isPast, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { FiMapPin, FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiUser, FiHome, FiDollarSign } from "react-icons/fi";

import './../styles/ReservasDetalles.css'; // Crearemos este archivo

const ReservasDetalles = () => {
    const { id } = useParams(); // Obtiene el ID de la reserva desde la URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isCompleting, setIsCompleting] = useState(false);

    // Obtener datos del estado global
    const { selectedReserva, selectedReservaStatus, error, updateStatus, updateError } = useSelector((state) => state.reservas);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const soyPublicador = user.id_usuario === selectedReserva?.salon?.publicador?.id_usuario;
    const soyArrendatario = user.id_usuario === selectedReserva?.arrendatario?.id_usuario;

    // Efecto para cargar los datos y limpiar al salir
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (id) {
            dispatch(fetchReservaById(id));
        } else {
            // Si no hay ID, redirigir o mostrar error
            console.error("No se proporcionó ID de reserva");
            navigate('/mis-reservas'); // O a donde prefieras
        }

        // Función de limpieza que se ejecuta al desmontar el componente
        return () => {
            dispatch(clearSelectedReserva());
        };
    }, [id, dispatch, isAuthenticated, navigate]);

    // Función para obtener icono, clase y texto según el estado (igual que en ItemReserva)
    const getEstadoInfo = (estado) => {
        switch (estado) {
            case 'confirmada':
                return { icon: <FiCheckCircle />, className: 'estado-confirmada', texto: 'Confirmada' };
            case 'cancelada':
                return { icon: <FiXCircle />, className: 'estado-cancelada', texto: 'Cancelada' };
            case 'completada':
                return { icon: <FiCheckCircle />, className: 'estado-completada', texto: 'Completada' };
            case 'creada':
            default:
                return { icon: <FiAlertCircle />, className: 'estado-pendiente', texto: 'Pendiente' };
        }
    };

    const handleCompletarClick = () => {
        if (!selectedReserva || isCompleting) return; // Evitar doble click

        Swal.fire({
            title: '¿Marcar como Completada?',
            text: `Confirmas que la reserva #${selectedReserva.id_reserva} ha finalizado.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#17a2b8', // Color 'info' de Bootstrap
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, marcar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsCompleting(true); // Indicar carga
                dispatch(updateReservaStatus({
                    id_reserva: selectedReserva.id_reserva,
                    estado_reserva: 'completada' // Nuevo estado
                }))
                .unwrap() // Para usar .then() y .catch()
                .then((updatedReserva) => {
                    Swal.fire(
                        '¡Actualizado!',
                        'La reserva ha sido marcada como completada.',
                        'success'
                    );
                    // No es necesario redirigir, el estado se actualizará
                })
                .catch((err) => {
                    Swal.fire(
                        'Error',
                        `No se pudo actualizar el estado: ${err || 'Error desconocido'}`,
                        'error'
                    );
                })
                .finally(() => {
                    setIsCompleting(false); // Quitar carga
                });
            }
        });
    };

    const handleCancelarClick = () => {
        if (!user || !selectedReserva) return;
        navigate(`/cancelar_salon/${user.id_usuario}/${selectedReserva.id_reserva}`);
    };

    const puedeMarcarCompletada = useMemo(() => {
        if (!selectedReserva || !user) return false;

        // 1. Ser el publicador
        const esPublicador = user.id_usuario === selectedReserva.salon?.publicador?.id_usuario;
        console.log("Es publicador: ",esPublicador);
        
        // 2. Estado actual 'confirmada'
        const estadoCorrecto = selectedReserva.estado_reserva === 'confirmada';

        console.log("ES CORRECTO: ", estadoCorrecto);
        
        // 3. Fecha/Hora pasada
        let tiempoPasado = true;
        if (selectedReserva.fecha_reserva && selectedReserva.hora_fin) {
            try {
                // Combina fecha y hora_fin para crear un objeto Date completo
                // Asume hora_fin es HH:MM:SS
                const endDateTime = parseISO(`${selectedReserva.fecha_reserva}T${selectedReserva.hora_fin}`);
                tiempoPasado = isPast(endDateTime);
            } catch (e) {
                console.error("Error parsing reservation end time:", e);
                tiempoPasado = false; // Si hay error al parsear, no mostrar botón
            }
        }

        console.log("Tiempo Pasado: ", tiempoPasado);

        console.log("FINAL:", esPublicador && estadoCorrecto && tiempoPasado);
        
        

        return esPublicador && estadoCorrecto && !tiempoPasado;
    }, [selectedReserva, user]);

    // Renderizado condicional principal
    if (selectedReservaStatus === 'loading') {
        return <div className="detalles-reserva-page loading"><h1>Cargando detalles de la reserva...</h1></div>;
    }

    if (selectedReservaStatus === 'failed') {
        return <div className="detalles-reserva-page error"><h1>Error al cargar la reserva</h1><p>{error}</p></div>;
    }

    if (!selectedReserva) {
        // Puede ocurrir brevemente antes de cargar o si falla silenciosamente
        return <div className="detalles-reserva-page error"><h1>Reserva no encontrada</h1></div>;
    }

    // Si tenemos los datos, los mostramos
    const { salon, arrendatario, fecha_reserva, hora_inicio, hora_fin, estado_reserva } = selectedReserva; //
    const estadoInfo = getEstadoInfo(estado_reserva); //
    const fechaFormateada = fecha_reserva ? format(parseISO(fecha_reserva), 'PPPP', { locale: es }) : 'N/A';

    return (
        <div className="detalles-reserva-page">
            <div className="detalles-reserva-header">
                <h1>Detalles de la Reserva #{selectedReserva.id_reserva}</h1>
                <span className={`reserva-estado-tag ${estadoInfo.className}`}>
                    {estadoInfo.icon} {estadoInfo.texto}
                </span>
            </div>

            <div className="detalles-reserva-content">
                <section className="detalle-seccion salon-info">
                    <h2>Salón Reservado</h2>
                    <Link to={`/salon/${salon?.id_salon}`} className="salon-nombre-link">
                        <FiHome className="icono" /> {salon?.nombre || 'Salón no disponible'}
                    </Link>
                    <p><FiMapPin className="icono" /> {salon?.direccion || 'Dirección no disponible'}</p>
                    {/* Podrías añadir más detalles del salón si los necesitas */}
                </section>

                <section className="detalle-seccion fecha-hora-info">
                    <h2>Fecha y Hora</h2>
                    <p><FiCalendar className="icono" /> {fechaFormateada}</p>
                    <p><FiClock className="icono" /> {hora_inicio} - {hora_fin}</p>
                </section>

                {/* Mostramos info del arrendatario (tú mismo en "Mis Reservas") */}
                {arrendatario && (
                    <section className="detalle-seccion arrendatario-info">
                        <h2>Reservado por</h2>
                        <p><FiUser className="icono" /> {arrendatario.nombre} {arrendatario.apellido}</p>
                        {/* Puedes añadir email o teléfono si es relevante */}
                    </section>
                )}

                {/* Aquí podrías añadir detalles del pago si los tienes */}
                <section className="detalle-seccion pago-info">
                    <h2>Detalles del Pago</h2>
                    <p><FiDollarSign className="icono"/> Monto: ${selectedReserva.transacciones?.[0]?.monto_pagado || 'N/A'}</p>
                    <p>Método: {selectedReserva.transacciones?.[0]?.metodo_pago || 'N/A'}</p>
                    <p>Estado: {selectedReserva.transacciones?.[0]?.estado_transaccion || 'N/A'}</p>
                </section>

                {/* Acciones posibles */}
                <section className="detalle-seccion acciones-reserva">
                    <h2>Acciones</h2>
                    {estado_reserva === 'confirmada' && (
                        <button className="btn-accion cancelar" onClick={handleCancelarClick}>
                            Cancelar Reserva
                        </button>
                    )}
                    {soyArrendatario && estado_reserva === 'completada' && !selectedReserva.resenia && (
                        <button className="btn-accion resenia">Dejar Reseña</button>
                    )}
                    {estado_reserva === 'cancelada' && selectedReserva.cancelacion && (
                        <p className='info-cancelacion'>
                            Cancelado el {format(parseISO(selectedReserva.cancelacion.fecha_cancelacion), 'dd/MM/yyyy HH:mm')}
                            por {selectedReserva.cancelacion.cancelado_por}.
                            Motivo: {selectedReserva.cancelacion.motivo}
                        </p>
                    )}

                    {puedeMarcarCompletada && ( // Mostrar solo si se cumplen las condiciones
                        <button
                            className="btn-accion completar" // Añadir clase CSS si necesitas estilo específico
                            onClick={handleCompletarClick}
                            disabled={isCompleting || updateStatus === 'loading'} // Deshabilitar mientras se procesa
                        >
                            {isCompleting || updateStatus === 'loading' ? 'Marcando...' : 'Marcar como Completada'}
                        </button>
                    )}
                    <button className="btn-accion volver" onClick={() => navigate('/mis-reservas')}>Volver a Mis Reservas</button>
                </section>

            </div>
        </div>
    );
};

export default ReservasDetalles;