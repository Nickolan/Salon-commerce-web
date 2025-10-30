// src/Components/reservaciones_recibidas/Reservacionesrec.jsx

import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReservasRecibidas, confirmarRechazarReserva } from "../../store/features/reservas/reservasSlice"; // Asegúrate de importar confirmarRechazarReserva
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import Swal from 'sweetalert2'; // Importar Swal
import { FaCheck } from "react-icons/fa";

// Importar estilos de Bootstrap (si aún los necesitas para algo más, si no, puedes quitarlos)
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./reservacionesrec.css"; // Ruta actualizada
import { AiOutlineDownCircle, AiOutlineUpCircle } from 'react-icons/ai';
// Importar iconos para acciones si los usas
import { FiCheck, FiX } from 'react-icons/fi';

function Reservacionesrec() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { reservasRecibidas, reservasRecibidasStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [visibleCount, setVisibleCount] = useState(5);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            if (reservasRecibidasStatus === 'idle' || reservasRecibidasStatus === 'failed') {
                dispatch(fetchReservasRecibidas());
            }
        }
    }, [isAuthenticated, reservasRecibidasStatus, dispatch, navigate]);

    const expandirse = () => {
        setVisibleCount(reservasRecibidas.length);
    };
    const reducir = () => {
        setVisibleCount(5);
    };

    // Navegar al detalle de la reserva
    const handleRowClick = (idReserva) => {
        navigate(`/reservas_detalles/${idReserva}`);
    };

    // Manejador para Confirmar/Rechazar (como lo implementaste antes)
    const handleDecision = (e, idReserva, decision) => {
        e.stopPropagation(); // MUY IMPORTANTE: Evita que el clic active handleRowClick
        const texto = decision === 'confirmada' ? 'confirmar' : 'rechazar';
        Swal.fire({
            title: `¿Estás seguro de ${texto} esta reserva?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: decision === 'confirmada' ? '#28a745' : '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Sí, ${texto}`,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(confirmarRechazarReserva({ idReserva: idReserva, nuevoEstado: decision }))
                    .unwrap()
                    .then(() => {
                        Swal.fire('Actualizado', `La reserva ha sido ${decision === 'confirmada' ? 'confirmada' : 'rechazada'}.`, 'success');
                    })
                    .catch((err) => {
                        Swal.fire('Error', err || 'No se pudo actualizar el estado.', 'error');
                    });
            }
        });
    };

    const renderTableContent = () => {
        if (reservasRecibidasStatus === 'loading') {
            return <tr><td colSpan="8" className="status-message loading">Cargando reservaciones...</td></tr>; // Aumentado colSpan
        }
        if (reservasRecibidasStatus === 'failed') {
            return <tr><td colSpan="8" className="status-message error">Error al cargar: {error}</td></tr>; // Aumentado colSpan
        }
        if (reservasRecibidasStatus === 'succeeded' && reservasRecibidas.length === 0) {
            return <tr><td colSpan="8" className="status-message empty">No has recibido ninguna reservación aún.</td></tr>; // Aumentado colSpan
        }

        return reservasRecibidas.slice(0, visibleCount).map((reserva) => (
            // Añadimos onClick a la fila y una clase para el cursor pointer
            <tr key={reserva.id_reserva} onClick={() => handleRowClick(reserva.id_reserva)} className="fila-reserva-clickable">
                {/* Usamos data-label para responsividad */}
                <td data-label="Cliente">{reserva.arrendatario?.nombre} {reserva.arrendatario?.apellido}</td>
                <td data-label="Salón">{reserva.salon?.nombre}</td>
                <td data-label="Fecha">{reserva.fecha_reserva ? format(parseISO(reserva.fecha_reserva), 'dd/MM/yyyy', { locale: es }) : 'N/A'}</td>
                <td data-label="Desde">{reserva.hora_inicio?.substring(0, 5)}</td>
                <td data-label="Hasta">{reserva.hora_fin?.substring(0, 5)}</td>
                <td data-label="Estado">
                    {/* Reutilizamos el estilo de badge de otros componentes */}
                    <span className={`status-badge status-reserva-${reserva.estado_reserva}`}>
                        {reserva.estado_reserva}
                    </span>
                </td>
                <td data-label="Nro. Reserva">{reserva.id_reserva}</td>
                {/* Celda de Acciones */}
                <td data-label="Acciones" className="celda-acciones">
                    {reserva.estado_reserva === 'creada' && (
                        <div className="acciones-propietario">
                            <button
                                className="btn-accion-tabla confirmar" // Clase CSS
                                onClick={(e) => handleDecision(e, reserva.id_reserva, 'confirmada')}
                                disabled={reservasRecibidasStatus === 'loading'}
                                title="Confirmar Reserva"
                            >
                                <FiCheck />
                            </button>
                            <button
                                className="btn-accion-tabla rechazar" // Clase CSS
                                onClick={(e) => handleDecision(e, reserva.id_reserva, 'rechazada')}
                                disabled={reservasRecibidasStatus === 'loading'}
                                title="Rechazar Reserva"
                            >
                                <FiX /> {/* Icono */}
                            </button>
                        </div>
                    )}
                    {/* Puedes añadir un placeholder o dejar vacío si no hay acciones */}
                    {reserva.estado_reserva !== 'creada' && (
                       <span>-</span> // O un guión para indicar que no hay acciones
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <Fragment>
            {/* Usamos clases más descriptivas */}
            <div className="pagina-reservaciones-recibidas">
                <h2 className="titulo-pagina">Reservaciones Recibidas</h2>
                <div className="contenedor-tabla"> {/* Envuelve la tabla para padding/sombra */}
                    <div className="tabla-scroll"> {/* Permite scroll horizontal si es necesario */}
                        <table className="tabla-reservaciones"> {/* Clase base para la tabla */}
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Salón</th>
                                    <th>Fecha</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                    <th>Estado</th>
                                    <th>Nro. Reserva</th>
                                    <th>Acciones</th> {/* Nueva columna */}
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableContent()}
                            </tbody>
                        </table>
                    </div>
                </div>

                {reservasRecibidas && reservasRecibidas.length > 5 && (
                    <div className="botones-paginacion">
                        {visibleCount < reservasRecibidas.length ? (
                            <button onClick={expandirse} className="btn-ver-mas" title="Mostrar todas">
                                <AiOutlineDownCircle className="icono-ver-mas" /> Ver Todas
                            </button>
                        ) : (
                            <button onClick={reducir} className="btn-ver-mas" title="Mostrar menos">
                                <AiOutlineUpCircle className="icono-ver-mas" /> Ver Menos
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default Reservacionesrec;