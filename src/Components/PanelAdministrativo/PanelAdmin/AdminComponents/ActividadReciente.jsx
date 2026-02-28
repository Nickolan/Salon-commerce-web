import React, { useState } from 'react';
import './ActividadReciente.css';

const ActividadReciente = ({ data, selectedMonth }) => {
  const [modoExpandido, setModoExpandido] = useState(false);
  
  const actividadesPlaceholder = [
    {
      id: 1,
      usuario: { nombre: 'Juan', apellido: 'Pérez', foto: null, iniciales: 'JP' },
      textoCompleto: 'Juan Pérez reservó Salón Luxor',
      detalle: 'Reserva #00012345',
      fecha: 'Hace 5 min.'
    },
    {
      id: 2,
      usuario: { nombre: 'María', apellido: 'González', foto: null, iniciales: 'MG' },
      textoCompleto: 'María González publicó Salón Esmeralda',
      detalle: 'Salón #67890',
      fecha: 'Hace 2 horas'
    },
    {
      id: 3,
      usuario: { nombre: 'Carlos', apellido: 'López', foto: null, iniciales: 'CL' },
      textoCompleto: 'Carlos López se unió como usuario',
      detalle: 'Usuario #54321',
      fecha: 'Hace 1 día'
    }
  ];

  const handleVerTodo = () => {
    setModoExpandido(!modoExpandido);
  };

  return (
    <div className="actividad-reciente">
      <div className="actividad-header">
        <h3 className="actividad-titulo">Actividad Reciente</h3>
        <div className="actividad-ver-todo" onClick={handleVerTodo}>
          {modoExpandido ? 'Ver menos' : 'Ver todo'}
        </div>
      </div>

      <div className={`actividad-lista ${modoExpandido ? 'modo-expandido' : 'modo-compacto'}`}>
        {actividadesPlaceholder.map((actividad, index) => (
          <React.Fragment key={actividad.id}>
            <div className={`actividad-item ${modoExpandido ? 'modo-expandido' : ''}`}>
              {/* Avatar y texto en la MISMA línea usando grid */}
              <div className="actividad-avatar">
                {actividad.usuario.iniciales}
              </div>
              
              {/* Texto principal en la misma línea que el avatar */}
              <div className="actividad-texto-principal">
                {actividad.textoCompleto}
              </div>
              
              {/* Detalle y fecha en la misma línea, debajo del texto principal */}
              {!modoExpandido && (
                <div className="actividad-detalle-linea">
                  <span className="actividad-detalle">{actividad.detalle}</span>
                  <span className="actividad-fecha">{actividad.fecha}</span>
                </div>
              )}
            </div>
            
            {/* Modo expandido: estructura diferente */}
            {modoExpandido && (
              <div className="actividad-item-expandido">
                <div className="actividad-avatar">
                  {actividad.usuario.iniciales}
                </div>
                <div className="actividad-contenido-expandido">
                  <div className="actividad-texto-principal">
                    {actividad.textoCompleto}
                  </div>
                  <div className="actividad-detalle-linea">
                    <span className="actividad-detalle">{actividad.detalle}</span>
                  </div>
                  <div className="actividad-fecha-expandido">
                    {actividad.fecha}
                  </div>
                </div>
              </div>
            )}
            
            {index < actividadesPlaceholder.length - 1 && (
              <hr className="actividad-divisor" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ActividadReciente;