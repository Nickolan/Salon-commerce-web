import React from 'react';
import './ListasResenias.css';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';

// 1. Renombramos el prop a 'resenias' para más claridad
const ListasResenias = ({ resenias, renderizarEstrellas }) => {

  // Función interna para formatear la fecha
  const formatearFecha = (fechaISO) => { 
    try {
      // Formatear la fecha a un formato legible
      return format(parseISO(fechaISO), "dd 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };


  return (
    <div className='opiniones-destacadas'>
      <h2>Opiniones Destacadas</h2>

      {/* 2. Verificamos si el array 'resenias' está vacío */}
      {!resenias || resenias.length === 0 ? (
        <p className="sin-resenias-msg">Este salón aún no tiene reseñas. ¡Sé el primero en dejar una!</p>
      ) : (
        <div className="opiniones-grid">
          {resenias.map((opinion) => (
            <div key={opinion.id_resenia} className="opinion-card">
              <div className="opinion-header">
                {/* 3. Corregimos el origen del nombre del usuario */}
                <span className="usuario-nombre">
                  {opinion.reserva?.arrendatario?.nombre || 'Usuario'}{' '}
                  {opinion.reserva?.arrendatario?.apellido || ''}
                </span>
                {/* 4. Usamos la función 'renderizarEstrellas' recibida por props */}
                <div className="opinion-estrellas">
                  {renderizarEstrellas(opinion.calificacion)}
                </div>
              </div>
              <p className="opinion-comentario">{opinion.comentario}</p>
              {/* 5. Añadimos la fecha de la reseña */}
              <p className="opinion-fecha">
                {formatearFecha(opinion.fecha_creacion)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListasResenias;