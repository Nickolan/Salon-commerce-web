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
  const [lugares, setLugares] = useState([]); //lista de lugares

  const handleBuscar = (ubicacion, personasMin) => {
    if (!ubicacion.trim()) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: ubicacion }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;


        const resultados = salonesData.filter(salon => {
          const distancia = calcularDistanciaKm(lat, lng, salon.lat, salon.lng);
          return distancia <= 5 && salon.capacidad >= personasMin;
        });


        if (resultados.length === 0) {
          alert('No se encontraron salones cercanos en esa ubicación.');
        }

        setLugares(resultados);
      } else {
        alert('No se pudo encontrar la ubicación.');
      }
    });
  };
  
  
  function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  const repetirSalones = (salones) => {
    return salones.flatMap(salon => Array(5).fill(salon));
  };

  return (
    <div className='screen-wrapper'>

      <div className='title'>
        <h1>¿Quiéres reservar un salón para ti?</h1>
        <h2>¡Encuentra los mejores salones para reservar aquí!</h2>
      </div>

      <Searchbar onBuscar={handleBuscar} />
      <h2>Lugares encontrados:</h2>
      <p>No hay lugares aún.</p>


      <div className='subtitulos'>
        <div className='logo-group'>
          <h3>Los mejores puntuados</h3>
          <Carrusel>
            {repetirSalones(mejorPuntuado).map((salon, index) => (
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
          <h3>Cerca de ti</h3>
          <Carrusel>
            {repetirSalones(cercaDti).map((salon, index) => (
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
            {repetirSalones(vistoRecien).map((salon, index) => (
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
      </div>
    </div>
  )
}

export default HomeScreen
