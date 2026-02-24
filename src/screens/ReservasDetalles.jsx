import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReservaById, clearSelectedReserva } from '../store/features/reservas/reservasSlice';
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { FiCalendar } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import { GoClock } from "react-icons/go";
import ComprobanteView from '../Components/ItemReserva/ComprobanteView'; // <-- Importar el componente
import './../styles/ReservasDetalles.css';

const ReservasDetalles = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedReserva, selectedReservaStatus, error } = useSelector((state) => state.reservas);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    
    const [showComprobante, setShowComprobante] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (id) {
            dispatch(fetchReservaById(id));
        }

        return () => {
            dispatch(clearSelectedReserva());
        };
    }, [id, dispatch, isAuthenticated, navigate]);

    // es para que el id tenga 8 digitos, si no tiene se le agregan ceros a la izquierda hasta completar los 8 digitos
    const formattedId = selectedReserva?.id_reserva 
        ? String(selectedReserva.id_reserva).padStart(8, '0') 
        : '00000000';

    // Función para obtener color del estado de transacción
    const getEstadoTransaccionColor = (estado) => {
        const colores = {
            'aprobado': '#55AB52',
            'pendiente': '#787878',
            'rechazado': '#AD1519',
            'reembolso': '#FFA500'
        };
        return colores[estado] || '#787878';
    };

    const handleVolverAReservar = () => {
        if (selectedReserva?.salon?.id_salon) {
            navigate(`/salon/${selectedReserva.salon.id_salon}`);
        }
    };

    const handleVerComprobante = () => {
        setShowComprobante(true); // <-- Mostrar el comprobante modal
    };

    if (selectedReservaStatus === 'loading') {
        return <div className="detalles-page loading"><h1>Cargando detalles de la reserva...</h1></div>;
    }

    if (selectedReservaStatus === 'failed') {
        return <div className="detalles-page error"><h1>Error al cargar la reserva</h1><p>{error}</p></div>;
    }

    if (!selectedReserva) {
        return <div className="detalles-page error"><h1>Reserva no encontrada</h1></div>;
    }

    const { salon, fecha_reserva, hora_inicio, hora_fin } = selectedReserva;
    const transaccion = selectedReserva.transacciones?.[0];
    
    const fechaFormateada = fecha_reserva 
        ? format(parseISO(fecha_reserva), "dd 'de' MMMM 'de' yyyy", { locale: es })
        : 'Fecha no disponible';

    // Puntos para el resumen de pago
    const puntos = '................................................................................';

    return (
        <div className="detalles-page">
            <div className="detalles-grid">
                {/* Contenedor Izquierdo - Detalles del Salón */}
                <div className="salon-detalle-card">
                    <div className="detalle-header">
                        <span className="reserva-id">#{formattedId}</span>
                        <div 
                            className="estado-badge"
                            style={{ backgroundColor: getEstadoTransaccionColor(transaccion?.estado_transaccion) }}
                        >
                            {transaccion?.estado_transaccion || 'pendiente'}
                        </div>
                    </div>

                    <div className="salon-detalle-content">
                        <div className="salon-detalle-imagen-wrapper">
                            <img 
                                src={salon?.fotos?.[0] || 'https://via.placeholder.com/493x269'}
                                alt={salon?.nombre}
                                className="salon-detalle-imagen"
                            />
                        </div>

                        <div className="salon-detalle-info">
                            <h2 className="salon-detalle-nombre">{salon?.nombre || 'Salón sin nombre'}</h2>
                            
                            <div className="direccion-linea">
                                <LuMapPin size={15} color="#B3B3B3" />
                                <span className="direccion-texto">{salon?.direccion || 'Dirección no disponible'}</span>
                            </div>

                            <div className="linea-separadora-detalle"></div>

                            <div className="fecha-detalle">
                                <FiCalendar size={15} color="#C8AD7F" />
                                <span className="fecha-detalle-texto">{fechaFormateada}</span>
                            </div>

                            <div className="hora-detalle">
                                <GoClock size={15} color="#C8AD7F" />
                                <span className="hora-detalle-texto">{hora_inicio} - {hora_fin}</span>
                            </div>

                            {/* Botón VOLVER A RESERVAR como div onClick */}
                            <div className="volver-reservar-boton" onClick={handleVolverAReservar}>
                                VOLVER A RESERVAR
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenedor Derecho - Resumen de Pago */}
                <div className="pago-detalle-card">
                    <h3 className="pago-titulo">Resumen de Pago</h3>
                    
                    <div className="pago-lineas">
                        <div className="pago-linea">
                            <span className="pago-concepto">Servicio</span>
                            <span className="pago-puntos">{puntos}</span>
                            <span className="pago-monto">$ {transaccion?.monto_pagado?.toLocaleString('es-CL') || '0'}</span>
                        </div>
                    </div>

                    <div className="linea-horizontal"></div>

                    <div className="total-linea">
                        <span className="total-label">TOTAL</span>
                        <span className="total-monto">$ {transaccion?.monto_pagado?.toLocaleString('es-CL') || '0'}</span>
                    </div>

                    {/* Método de pago */}
                    <div className="metodo-pago-container">
                        <span className="metodo-pago-texto">{transaccion?.metodo_pago || 'Mercado Pago'}</span>
                    </div>

                    {/* Ver Comprobante */}
                    <div className="ver-comprobante" onClick={handleVerComprobante}>
                        Ver Comprobante
                    </div>
                </div>
            </div>

            {/* Modal de Comprobante */}
            {showComprobante && (
                <ComprobanteView 
                    reserva={selectedReserva} 
                    onClose={() => setShowComprobante(false)} 
                />
            )}
        </div>
    );
};

export default ReservasDetalles;