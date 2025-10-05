import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';
import './ItemReserva.css';

const ItemReserva = ({ reserva, salon, estado, formatearFecha, formatearHora }) => {
  return (
    <div className='card-reserva'>
      <div className='card-imagen-wrapper'>
        <img
          src={salon?.fotos[0]}
          alt={salon?.nombre}
          className='card-imagen'
        />
      </div>
      <div className='card-izquierda'>
        <div className='estado-reserva'>
          <p className='estado-texto'>{estado}</p>
        </div>
        <div className='disponibilidad'>
          <p className='salon-caracteristica'>
            <FiCalendar className='icono' />
            {formatearFecha(reserva.fecha_reserva)}
          </p>
          <p className='salon-caracteristica'>
            <FiClock className='icono' />
            {formatearHora(reserva.hora_inicio)} - {formatearHora(reserva.hora_fin)}
          </p>
        </div>
        <p className='salon-info'>Check and Home {salon?.id_salon} - {salon?.nombre}</p>
      </div>
      <div className='card-derecha'>
        <div className='button-container'>
          <Link
            to="/reservas_detalles"
            state={{
              estado: estado,
              fecha: formatearFecha(reserva.fecha_reserva),
              horaInicio: formatearHora(reserva.hora_inicio),
              horaFin: formatearHora(reserva.hora_fin),
              idSalon: salon?.id_salon,
              nombreSalon: salon?.nombre
            }}
          >
            <div className="button-ver">VER</div>
          </Link>
          {estado === "Completado" && (
            <div className="button-opinar">OPINAR</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemReserva;
