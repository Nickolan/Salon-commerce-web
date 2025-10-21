import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReservasRecibidas } from "../../store/features/reservas/reservasSlice"; // Ajusta la ruta si es necesario
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./reservacionesrec.css"; // Asegúrate que la ruta sea correcta
import { AiOutlineDownCircle, AiOutlineUpCircle } from 'react-icons/ai';

function Reservacionesrec() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Obtener datos y estado desde Redux
    const { reservasRecibidas, reservasRecibidasStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Estado para controlar cuántas filas mostrar
    const [visibleCount, setVisibleCount] = useState(5); // Mostrar 5 por defecto

    // Cargar reservas recibidas al montar y proteger ruta
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            // Cargar solo si es necesario
            if (reservasRecibidasStatus === 'idle' || reservasRecibidasStatus === 'failed') {
                dispatch(fetchReservasRecibidas());
            }
        }
    }, [isAuthenticated, reservasRecibidasStatus, dispatch, navigate]);

    const expandirse = () => {
        setVisibleCount(reservasRecibidas.length); // Mostrar todas
    };
    const reducir = () => {
        setVisibleCount(5); // Volver a mostrar 5
    };

    // Función para renderizar el contenido de la tabla
    const renderTableContent = () => {
        if (reservasRecibidasStatus === 'loading') {
            return <tr><td colSpan="7">Cargando reservaciones...</td></tr>;
        }
        if (reservasRecibidasStatus === 'failed') {
            return <tr><td colSpan="7" style={{color: 'red'}}>Error al cargar: {error}</td></tr>;
        }
        if (reservasRecibidasStatus === 'succeeded' && reservasRecibidas.length === 0) {
            return <tr><td colSpan="7">No has recibido ninguna reservación aún.</td></tr>;
        }

        // Mostrar solo las filas visibles
        return reservasRecibidas.slice(0, visibleCount).map((reserva) => (
            <tr key={reserva.id_reserva}>
                {/* Mostramos nombre y apellido del cliente */}
                <td>{reserva.arrendatario?.nombre} {reserva.arrendatario?.apellido}</td>
                <td>{reserva.salon?.nombre}</td>
                {/* Formateamos la fecha */}
                <td>{reserva.fecha_reserva ? format(parseISO(reserva.fecha_reserva), 'dd/MM/yyyy', { locale: es }) : 'N/A'}</td>
                <td>{reserva.hora_inicio}</td>
                <td>{reserva.hora_fin}</td>
                <td>{reserva.estado_reserva}</td>
                <td>{reserva.id_reserva}</td>
            </tr>
        ));
    };

    return (
        <Fragment>
            <div className="reservaciones-rec-page"> {/* Clase contenedora */}
                <h2 className="titulo">Reservaciones recibidas</h2>
                <div className="container mt-4">
                    <div className="table-responsive">
                        {/* Usamos una sola tabla ahora */}
                        <table className="table text-center tabla-reservaciones">
                            <thead className="nombres_de_filas">
                                <tr>
                                    <th>Cliente</th>
                                    <th>Salón</th>
                                    <th>Fecha</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                    <th>Estado</th>
                                    <th>Nro. Reserva</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableContent()}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Botones de expansión (solo si hay más reservas que las visibles inicialmente) */}
                {reservasRecibidas && reservasRecibidas.length > 5 && (
                    <div className="text-center botones_expansion">
                        {visibleCount < reservasRecibidas.length ? (
                            <button onClick={expandirse} title="Mostrar todas">
                                <AiOutlineDownCircle className="fs-1" />
                            </button>
                        ) : (
                            <button onClick={reducir} title="Mostrar menos">
                                <AiOutlineUpCircle className="fs-1" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
}

export default Reservacionesrec;