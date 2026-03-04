import React, { useState, useEffect } from 'react';
import CancelacionService from '../../../store/features/cancelacion/cancelacionService';
import Swal from 'sweetalert2';
import './PopupCancelar.css';

const PopupCancelar = ({ reserva, onClose, onSuccess }) => {
    const [motivo, setMotivo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reembolsoInfo, setReembolsoInfo] = useState(null);

    useEffect(() => {
        const cargarInfoReembolso = async () => {
            try {
                const info = await CancelacionService.calcularReembolso(reserva.id_reserva);
                setReembolsoInfo(info);
            } catch (error) {
                console.error('Error al cargar info de reembolso:', error);
            }
        };

        if (reserva?.id_reserva) {
            cargarInfoReembolso();
        }
    }, [reserva]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!motivo.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Motivo requerido',
                text: 'Por favor indica el motivo de la cancelación',
                confirmButtonColor: '#C8AD7F'
            });
            return;
        }

        setIsLoading(true);

        try {
            await CancelacionService.cancelarReserva(reserva.id_reserva, motivo);
            
            const mensajeReembolso = reembolsoInfo?.porcentajeReembolso > 0 
                ? `Se procesará un reembolso del ${reembolsoInfo.porcentajeReembolso}% ($${reembolsoInfo.montoReembolso?.toLocaleString('es-CL')})`
                : 'No aplica reembolso para cancelaciones con menos de 24 horas de anticipación.';

            Swal.fire({
                icon: 'success',
                title: 'Reserva cancelada',
                html: `
                    <p>La reserva ha sido cancelada exitosamente.</p>
                    <p style="margin-top: 10px; font-weight: 600;">${mensajeReembolso}</p>
                `,
                confirmButtonColor: '#C8AD7F'
            });
            
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error en cancelación:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || error.message || 'No se pudo cancelar la reserva',
                confirmButtonColor: '#C8AD7F'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content popup-cancelar" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                
                <h2 className="popup-title">CANCELAR RESERVA</h2>
                
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
                    </div>
                </div>

                {reembolsoInfo && (
                    <div className="reembolso-info">
                        <div className="reembolso-header">
                            <span className="reembolso-titulo">Política de cancelación</span>
                            <span className={`reembolso-porcentaje ${reembolsoInfo.porcentajeReembolso === 0 ? 'sin-reembolso' : ''}`}>
                                {reembolsoInfo.porcentajeReembolso}% reembolso
                            </span>
                        </div>
                        
                        <div className="reembolso-detalle">
                            <div className="reembolso-linea">
                                <span>Monto pagado:</span>
                                <span>$ {reembolsoInfo.montoOriginal?.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="reembolso-linea">
                                <span>Monto a reembolsar:</span>
                                <span className="monto-reembolso">
                                    $ {reembolsoInfo.montoReembolso?.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        <div className="reembolso-nota">
                            {reembolsoInfo.porcentajeReembolso === 100 && (
                                <p>✅ Cancelación con más de 48 horas de anticipación: Reembolso completo</p>
                            )}
                            {reembolsoInfo.porcentajeReembolso === 50 && (
                                <p>⚠️ Cancelación entre 24 y 48 horas de anticipación: Reembolso del 50%</p>
                            )}
                            {reembolsoInfo.porcentajeReembolso === 0 && (
                                <p>❌ Cancelación con menos de 24 horas de anticipación: Sin reembolso</p>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="motivo">MOTIVO DE CANCELACIÓN</label>
                        <textarea
                            id="motivo"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Por favor, indica el motivo de la cancelación..."
                            rows="4"
                            maxLength="300"
                            required
                        />
                        <span className="caracteres-counter">{motivo.length}/300</span>
                    </div>

                    <div className="popup-actions">
                        <button 
                            type="button" 
                            className="btn-cancelar"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            VOLVER
                        </button>
                        <button 
                            type="submit" 
                            className="btn-confirmar-cancelar"
                            disabled={isLoading || !motivo.trim()}
                        >
                            {isLoading ? 'CANCELANDO...' : 'CONFIRMAR CANCELACIÓN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupCancelar;