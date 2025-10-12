import React from 'react';
import './ListasResenias.css';

const ListasResenias = ({ opDestacados, promedioCalificacion, renderizarEstrellas }) => {
  return (
    <div className='opiniones-destacadas'>
      <h2>Opiniones Destacadas</h2>
      <div className="opiniones-grid">
        {opDestacados.map((opinion, index) => (
          <div key={opinion.id_resenia} className="opinion-card">
            <div className="opinion-header">
              <span className="usuario-nombre">{opinion.nombre_usuario}</span>
              <span className="opinion-numero">{index + 1}</span>
            </div>
            <p className="opinion-comentario">{opinion.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListasResenias;