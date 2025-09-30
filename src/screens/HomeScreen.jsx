import React from 'react';
import '../styles/HomeScreen.css';
import salonesData from "../utils/salones.json";

const HomeScreen = () => {
  const mejorPuntuado = salonesData.filter(salon => salon.precio_por_hora === 5000.0);
  const cercaDti = salonesData.filter(salon => salon.precio_por_hora === 3500.0);
  const vistoRecien = salonesData.filter(salon => salon.precio_por_hora === 1500.0);

  return (
    <div className='screen-wrapper'>
      <div className='title'>
        <h1>¿Quiéres reservar un salón para ti?</h1>
        <h2>¡Encuentra los mejores salones para reservar aquí!</h2>
      </div>
      <div className='subtitulos'>
        <div className='logo-group'>
          <h3>Los mejores puntuados</h3>
          <div className='logos-row'>
            {mejorPuntuado.map((salon) =>
              Array(3).fill(0).map((_, index) => (
                <img
                  key={`${salon.id_salon}-${index}`}
                  src={salon.fotos[0]}
                  className='logo'
                  alt={salon.nombre}
                />
              ))
            )}
          </div>
        </div>
        <div className='logo-group'>
          <h3>Cerca de ti</h3>
          <div className='logos-row'>
            {cercaDti.map((salon) =>
              Array(3).fill(0).map((_, index) => (
                <img
                  key={`${salon.id_salon}-${index}`}
                  src={salon.fotos[0]}
                  className='logo'
                  alt={salon.nombre}
                />
              ))
            )}
          </div>
        </div>
        <div className='logo-group'>
          <h3>Visto recientemente</h3>
          <div className='logos-row'>
            {vistoRecien.map((salon) =>
              Array(3).fill(0).map((_, index) => (
                <img
                  key={`${salon.id_salon}-${index}`}
                  src={salon.fotos[0]}
                  className='logo'
                  alt={salon.nombre}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
