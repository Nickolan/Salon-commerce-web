import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock } from 'react-icons/fi';
import './ItemReserva.css';
import usuarios from '../../utils/Usuarios.json';

const ItemReserva = ({ reserva, salon, estado, formatearFecha, formatearHora, onOpinar }) => { 
  const usuarioPublicador = usuarios.find(usuario => usuario.id_usuario === salon?.id_publicador);

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

        <p className='salon-info'>
          Check and Home {salon?.id_salon} - {salon?.nombre}
        </p>
        <p className='salon-info'>
          Vendedor: {usuarioPublicador?.nombre} {usuarioPublicador?.apellido}
        </p>
      </div>

      <div className='card-derecha'>
        <div className='button-container'>
          <Link
            to={`/reservas_detalles/${reserva.id_reserva}`}
            state={{
              estado: estado,
              fecha: formatearFecha(reserva.fecha_reserva),
              horaInicio: formatearHora(reserva.hora_inicio),
              horaFin: formatearHora(reserva.hora_fin),
              idSalon: salon?.id_salon,
              nombreSalon: salon?.nombre
            }}
            className="button-ver"
          >
            VER
          </Link>

          {estado === "Completado" && (
            <Link
              to={`/reseniar/${reserva.id_salon}`}
              state={{
                desdeMisReservas: true,
                id_reserva: reserva.id_reserva,
                id_usuario: reserva.id_usuario,
                nombre_usuario: reserva.nombre_usuario
              }}
              className='button-opinar'
            >
              OPINAR
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemReserva;
