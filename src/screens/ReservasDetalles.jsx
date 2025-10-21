import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservaById, clearSelectedReserva } from '../store/features/reservas/reservasSlice';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { FiMapPin, FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiUser, FiHome, FiDollarSign } from "react-icons/fi";

import './../styles/ReservasDetalles.css'; // Crearemos este archivo

const ReservasDetalles = () => {
    const { id } = useParams(); // Obtiene el ID de la reserva desde la URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Obtener datos del estado global
    const { selectedReserva, selectedReservaStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated } = useSelector((state) => state.auth);

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
    const { salon, arrendatario, fecha_reserva, hora_inicio, hora_fin, estado_reserva } = selectedReserva;
    const estadoInfo = getEstadoInfo(estado_reserva);

    const fechaFormateada = fecha_reserva ? format(parseISO(fecha_reserva), 'PPPP', { locale: es }) : 'N/A'; // PPPP -> lunes, 19 de octubre de 2025

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
                         <FiHome className="icono"/> {salon?.nombre || 'Salón no disponible'}
                    </Link>
                    <p><FiMapPin className="icono"/> {salon?.direccion || 'Dirección no disponible'}</p>
                    {/* Podrías añadir más detalles del salón si los necesitas */}
                </section>

                <section className="detalle-seccion fecha-hora-info">
                    <h2>Fecha y Hora</h2>
                    <p><FiCalendar className="icono"/> {fechaFormateada}</p>
                    <p><FiClock className="icono"/> {hora_inicio} - {hora_fin}</p>
                </section>

                {/* Mostramos info del arrendatario (tú mismo en "Mis Reservas") */}
                {arrendatario && (
                    <section className="detalle-seccion arrendatario-info">
                        <h2>Reservado por</h2>
                        <p><FiUser className="icono"/> {arrendatario.nombre} {arrendatario.apellido}</p>
                        {/* Puedes añadir email o teléfono si es relevante */}
                    </section>
                )}

                {/* Aquí podrías añadir detalles del pago si los tienes */}
                {/* <section className="detalle-seccion pago-info">
                    <h2>Detalles del Pago</h2>
                    <p><FiDollarSign className="icono"/> Monto: ${selectedReserva.transacciones?.[0]?.monto_pagado || 'N/A'}</p>
                    <p>Método: {selectedReserva.transacciones?.[0]?.metodo_pago || 'N/A'}</p>
                    <p>Estado: {selectedReserva.transacciones?.[0]?.estado_transaccion || 'N/A'}</p>
                </section> */}

                {/* Acciones posibles */}
                <section className="detalle-seccion acciones-reserva">
                    <h2>Acciones</h2>
                    {estado_reserva === 'confirmada' && (
                        <button className="btn-accion cancelar">Cancelar Reserva</button>
                    )}
                    {estado_reserva === 'completada' && !selectedReserva.resenia && (
                        <button className="btn-accion resenia">Dejar Reseña</button>
                    )}
                    {estado_reserva === 'cancelada' && selectedReserva.cancelacion && (
                        <p className='info-cancelacion'>
                           Cancelado el {format(parseISO(selectedReserva.cancelacion.fecha_cancelacion), 'dd/MM/yyyy HH:mm')}
                           por {selectedReserva.cancelacion.cancelado_por}.
                           Motivo: {selectedReserva.cancelacion.motivo}
                        </p>
                    )}
                     <button className="btn-accion volver" onClick={() => navigate('/mis-reservas')}>Volver a Mis Reservas</button>
                </section>

            </div>
        </div>
    );
};

export default ReservasDetalles;