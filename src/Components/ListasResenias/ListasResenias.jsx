// src/Components/ListasResenias/ListasResenias.jsx
import React, { useState } from 'react';
import './ListasResenias.css';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

const ListasResenias = ({ resenias }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatearFecha = (fechaISO) => { 
    try {
      return format(parseISO(fechaISO), "dd 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };

  const handlePrev = () => {
    if (resenias?.length > 4) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (resenias?.length > 4) {
      setCurrentIndex((prev) => Math.min(resenias.length - 4, prev + 1));
    }
  };

  const mostrarResenias = resenias?.slice(currentIndex, currentIndex + 4) || [];

  return (
    <div className='listas-resenias-container'>
      <div className="resenias-header">
        <h2>OPINIONES DESTACADAS</h2>
        {resenias?.length > 4 && (
          <div className="resenias-carousel-controls">
            <div 
              className={`carousel-arrow ${currentIndex === 0 ? 'disabled' : ''}`}
              onClick={handlePrev}
            >
              &lt;
            </div>
            <div 
              className={`carousel-arrow ${currentIndex >= resenias.length - 4 ? 'disabled' : ''}`}
              onClick={handleNext}
            >
              &gt;
            </div>
          </div>
        )}
      </div>

      {!resenias || resenias.length === 0 ? (
        <p className="sin-resenias-msg">Este salón aún no tiene reseñas. ¡Sé el primero en dejar una!</p>
      ) : (
        <div className="resenias-grid">
          {mostrarResenias.map((opinion) => (
            <div key={opinion.id_resenia} className="resenia-card">
              <div className="resenia-header">
                <span className="resenia-nombre">
                  {opinion.reserva?.arrendatario?.nombre || 'Usuario'}
                </span>
                <div className="resenia-rating-circle">
                  {opinion.calificacion}
                </div>
              </div>
              <div className="resenia-contenido">
                <span className="resenia-comilla">"</span>
                <p className="resenia-comentario">{opinion.comentario}</p>
                <span className="resenia-comilla">"</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListasResenias;