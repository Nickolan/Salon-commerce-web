import React, { useState, useEffect } from 'react';
import CancelacionService from '../../../store/features/cancelacion/cancelacionService';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import './PopupVerMotivo.css';

const PopupVerMotivo = ({ reserva, onClose }) => {
    const [cancelacion, setCancelacion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarCancelacion = async () => {
            try {
                setIsLoading(true);
                setError(null);
                console.log('Cargando cancelación para reserva:', reserva.id_reserva);
                
                const data = await CancelacionService.obtenerCancelacionPorReserva(reserva.id_reserva);
                console.log('Datos de cancelación recibidos:', data);
                
                setCancelacion(data);
            } catch (error) {
                console.error('Error al cargar cancelación:', error);
                if (error.response?.status === 404) {
                    setError('Esta reserva no tiene un registro de cancelación. Puede que haya sido cancelada antes de implementar esta funcionalidad.');
                } else {
                    setError(error.response?.data?.message || 'No se pudo cargar la información de cancelación');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (reserva?.id_reserva) {
            cargarCancelacion();
        }
    }, [reserva]);

    const formatCanceladoPor = (canceladoPor) => {
        const traducciones = {
            'usuario': 'el usuario',
            'publicador': 'el publicador',
            'administrador': 'el administrador'
        };
        return traducciones[canceladoPor] || canceladoPor;
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'Fecha no disponible';
        try {
            // Si es un string ISO
            if (typeof fecha === 'string') {
                return format(parseISO(fecha), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
            }
            // Si es un objeto Date
            return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
        } catch {
            return fecha;
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content popup-ver-motivo" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                
                <h2 className="popup-title">DETALLE DE CANCELACIÓN</h2>
                
                <div className="reserva-info-resumen">
                    <img 
                        src={reserva.salon?.fotos?.[0] || 'https://via.placeholder.com/60x60'}
                        alt={reserva.salon?.nombre}
                        className="salon-miniatura"
                    />
                    <div className="reserva-detalles-mini">
                        <h3>{reserva.salon?.nombre}</h3>
                        <p className="reserva-fecha">
                            {new Date(reserva.fecha_reserva).toLocaleDateString('es-CL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <p className="reserva-hora">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                        <p className="reserva-estado" style={{ color: reserva.estado_reserva === 'cancelada' ? '#AD1519' : '#AD1519' }}>
                            {reserva.estado_reserva === 'cancelada' ? 'Cancelada' : 'Rechazada'}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando información...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-mensaje">{error}</p>
                        <p className="error-sugerencia">
                            Puedes intentar cancelar la reserva nuevamente para generar el registro.
                        </p>
                    </div>
                ) : cancelacion ? (
                    <div className="motivo-detalle">
                        <div className="motivo-item">
                            <span className="motivo-label">Cancelado por:</span>
                            <span className="motivo-valor cancelado-por">
                                {formatCanceladoPor(cancelacion.cancelado_por)}
                            </span>
                        </div>

                        <div className="motivo-item">
                            <span className="motivo-label">Fecha de cancelación:</span>
                            <span className="motivo-valor">
                                {formatFecha(cancelacion.fecha_cancelacion)}
                            </span>
                        </div>

                        {cancelacion.monto_reembolsado > 0 && (
                            <div className="motivo-item">
                                <span className="motivo-label">Monto reembolsado:</span>
                                <span className="motivo-valor monto-reembolso">
                                    $ {cancelacion.monto_reembolsado.toLocaleString('es-CL')}
                                </span>
                            </div>
                        )}

                        <div className="motivo-divider"></div>

                        <div className="motivo-item motivo-texto">
                            <span className="motivo-label">Motivo:</span>
                            <div className="motivo-contenido">
                                {cancelacion.motivo}
                            </div>
                        </div>

                        {cancelacion.politica_aplicada && (
                            <div className="politica-info">
                                <span className="politica-label">Política aplicada:</span>
                                <span className={`politica-valor ${cancelacion.politica_aplicada}`}>
                                    {cancelacion.politica_aplicada === 'total' && 'Reembolso total (100%)'}
                                    {cancelacion.politica_aplicada === 'parcial' && 'Reembolso parcial (50%)'}
                                    {cancelacion.politica_aplicada === 'nulo' && 'Sin reembolso'}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="sin-datos">
                        <p>No hay información de cancelación disponible</p>
                    </div>
                )}

                <div className="popup-actions">
                    <button 
                        type="button" 
                        className="btn-cerrar"
                        onClick={onClose}
                    >
                        CERRAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupVerMotivo;