import React, { useEffect, useState } from 'react'
import '../styles/HomeScreen.css'
import Carrusel from '../Components/Carrusel/Carrusel.jsx';
import ItemSalonSimple from '../Components/ItemSalonSimple/ItemSalonSimple.jsx';
import Reservas from '../utils/Reservas.json';
import Resenias from '../utils/Resenias.json';
import Searchbar from '../Components/SearchBar/searchbar'
import salonesData from "../utils/Salones.json";

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
      <div className='searchbar_homescreen'> 
        <Searchbar/>
      </div>
  
      <div className='subtitulos'>
        <div className='logo-group'>
          <h3>Los mejores puntuados</h3>
          <Carrusel>
            {salonesData.map((salon, index) => (
              <div key={`${salon.id_salon}-${index}`}>
                <ItemSalonSimple
                  id_salon={salon.id_salon}
                  nombre={salon.nombre}
                  precio={salon.precio_por_hora}
                  imagen={salon.fotos[0]}
                  reservas={Reservas.filter(reserva => reserva.id_salon === salon.id_salon)}
                  resenias={Resenias.filter(resenia =>
                    Reservas.some(reserva =>
                      reserva.id_salon === salon.id_salon &&
                      reserva.id_reserva === resenia.id_reserva
                    )
                  )}
                />
              </div>
            ))}
          </Carrusel>
        </div>
        {/* <div className='logo-group'>
          <h3>Cerca de ti</h3>
          <Carrusel>
            {salonesData.map((salon, index) => (
              <div key={`${salon.id_salon}-${index}`}>
                <ItemSalonSimple
                  id_salon={salon.id_salon}
                  nombre={salon.nombre}
                  precio={salon.precio_por_hora}
                  imagen={salon.fotos[0]}
                  reservas={Reservas.filter(reserva => reserva.id_salon === salon.id_salon)}
                  resenias={Resenias.filter(resenia =>
                    Reservas.some(reserva =>
                      reserva.id_salon === salon.id_salon &&
                      reserva.id_reserva === resenia.id_reserva
                    )
                  )}
                />
              </div>
            ))}
          </Carrusel>
        </div>
        <div className='logo-group'>
          <h3>Visto recientemente</h3>
          <Carrusel>
            {salonesData.map((salon, index) => (
              <div key={index}>
                <ItemSalonSimple
                  id_salon={salon.id_salon}
                  nombre={salon.nombre}
                  precio={salon.precio_por_hora}
                  imagen={salon.fotos[0]}
                  reservas={Reservas.filter(reserva => reserva.id_salon === salon.id_salon)}
                  resenias={Resenias.filter(resenia =>
                    Reservas.some(reserva =>
                      reserva.id_salon === salon.id_salon &&
                      reserva.id_reserva === resenia.id_reserva
                    )
                  )}
                />
              </div>
            ))}
          </Carrusel>
        </div> */}
      </div>
    </div>
  )
}

export default HomeScreen
