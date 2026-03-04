import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createResenia } from '../../../store/features/salones/salonSlice';
import Swal from 'sweetalert2';
import './PopupOpinion.css';

const PopupOpinion = ({ reserva, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { reseniaStatus, reseniaError } = useSelector((state) => state.salones);
    
    const [calificacion, setCalificacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (calificacion === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Calificación requerida',
                text: 'Por favor selecciona una calificación',
                confirmButtonColor: '#C8AD7F'
            });
            return;
        }

        try {
            const resultAction = await dispatch(createResenia({
                id_reserva: reserva.id_reserva,
                calificacion,
                comentario: comentario.trim() || null
            }));

            if (createResenia.fulfilled.match(resultAction)) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Gracias por tu opinión!',
                    text: 'Tu reseña ha sido publicada exitosamente',
                    confirmButtonColor: '#C8AD7F'
                });
                onSuccess?.();
                onClose();
            } else {
                throw new Error(resultAction.payload || 'Error al publicar la reseña');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo publicar la reseña',
                confirmButtonColor: '#C8AD7F'
            });
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`star-icon ${star <= (hoveredStar || calificacion) ? 'active' : ''}`}
                onClick={() => setCalificacion(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={star <= (hoveredStar || calificacion) ? 'currentColor' : 'none'}
                />
            </svg>
        ));
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content popup-opinion" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close" onClick={onClose}>×</button>
                
                <h2 className="popup-title">OPINAR SOBRE LA EXPERIENCIA</h2>
                
                <div className="salon-info-resumen">
                    <img 
                        src={reserva.salon?.fotos?.[0] || 'https://via.placeholder.com/60x60'}
                        alt={reserva.salon?.nombre}
                        className="salon-miniatura"
                    />
                    <div className="salon-detalles-mini">
                        <h3>{reserva.salon?.nombre}</h3>
                        <p>{new Date(reserva.fecha_reserva).toLocaleDateString('es-CL')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>CALIFICACIÓN</label>
                        <div className="estrellas-container">
                            {renderStars()}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>COMENTARIO (OPCIONAL)</label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Cuéntanos tu experiencia..."
                            rows="4"
                            maxLength="500"
                        />
                        <span className="caracteres-counter">{comentario.length}/500</span>
                    </div>

                    <div className="popup-actions">
                        <button 
                            type="button" 
                            className="btn-cancelar"
                            onClick={onClose}
                        >
                            CANCELAR
                        </button>
                        <button 
                            type="submit" 
                            className="btn-opinar"
                            disabled={reseniaStatus === 'loading'}
                        >
                            {reseniaStatus === 'loading' ? 'PUBLICANDO...' : 'OPINAR'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupOpinion;