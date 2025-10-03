import React from 'react';
import './DatosSalonCompleto.css';
import { FaRegMap } from "react-icons/fa";
import mapaPlaceHolder from '/src/assets/img/mapaPlaceHolder.png';

const DatosSalonCompleto = ({ salon }) => {
  if (!salon) return null;

  return (
    <div className='datosSalonCompleto'>
      <div className="contenedor-principal">
        <div className="columna-izquierda">
          <div className="mapa-ubicacion">
            <img 
              src={mapaPlaceHolder} 
              alt="Mapa de ubicación" 
              className="mapa-imagen"
            />
          </div>
          
          <div className="precio-salon">
            <span className="precio-texto">${salon.precio_por_hora}</span>
            <span className="precio-label">por hora</span>
          </div>
        </div>

        <div className="columna-derecha">
          <div className="imagen-salon">
            {salon.fotos && salon.fotos.length > 0 && (
              <img src={salon.fotos[0]} alt={`Imagen de ${salon.nombre}`} />
            )}
          </div>

          <div className="detalles-secundarios">
            <div className='equipamiento'>
              {salon.equipamientos_json && (
                <>
                  {salon.equipamientos_json.wifi && <h3>Wi-Fi</h3>}
                  {salon.equipamientos_json.proyector && <h3>Proyector</h3>}
                  {salon.equipamientos_json.pizarra && <h3>Pizarra</h3>}
                  {salon.equipamientos_json.aire_acondicionado && <h3>Aire Acondicionado</h3>}
                </>
              )}
            </div>
            <div className='reglas'>
              {salon.reglas && salon.reglas.map((regla, index) => <h3 key={index}>{regla}</h3>)}
            </div>
          </div>
        </div>
      </div>

      <div className='descripcion'>
        <p>{salon.descripcion}</p>
      </div>
    </div>
  );
};

export default DatosSalonCompleto;