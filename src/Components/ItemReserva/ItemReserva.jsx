import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiKey } from "react-icons/fi";
import './ItemReserva.css';

const ItemReserva = ({ reserva }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Obtener la transacción asociada a la reserva
  const transaccion = reserva.transacciones?.[0];

  const handleCardClick = () => {
    navigate(`/reservas_detalles/${reserva.id_reserva}`);
  };

  // Función para obtener color y texto según el estado
  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'confirmada':
        return { 
          bgColor: '#55AB52', 
          textColor: '#085D14',
          texto: 'Confirmada' 
        };
      case 'completada':
        return { 
          bgColor: '#55AB52', 
          textColor: '#085D14',
          texto: 'Completada' 
        };
      case 'cancelada':
        return { 
          bgColor: '#AD1519', 
          textColor: '#AD1519',
          texto: 'Cancelada' 
        };
      case 'rechazada':
        return { 
          bgColor: '#AD1519', 
          textColor: '#AD1519',
          texto: 'Rechazada' 
        };
      case 'creada':
      default:
        return { 
          bgColor: '#787878', 
          textColor: '#787878',
          texto: 'Creada' 
        };
    }
  };

  const estadoInfo = getEstadoInfo(reserva.estado_reserva);

  // Formatear fecha a dd-mm-aa
  const fechaFormateada = reserva.fecha_reserva 
    ? format(parseISO(reserva.fecha_reserva), 'dd-MM-yy') 
    : 'Fecha no disponible';

  // Formatear hora sin segundos
  const horaInicioFormateada = reserva.hora_inicio?.substring(0, 5) || '00:00';
  const horaFinFormateada = reserva.hora_fin?.substring(0, 5) || '00:00';

  return (
    <div 
      className={`item-reserva-card estado-${reserva.estado_reserva}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Imagen a la izquierda */}
      <div className="item-reserva-imagen-wrapper">
        <img
          src={reserva.salon?.fotos?.[0] || 'https://via.placeholder.com/333x141?text=Salón'}
          alt={reserva.salon?.nombre || 'Salón'}
          className="item-reserva-imagen"
        />
      </div>

      {/* Contenido a la derecha */}
      <div className="item-reserva-contenido">
        {/* Fila superior: Nombre del salón y estado */}
        <div className="item-reserva-header">
          <h3 className="item-reserva-titulo">
            {reserva.salon?.nombre || 'Salón no disponible'}
          </h3>
          <div 
            className="item-reserva-estado"
            style={{ backgroundColor: `${estadoInfo.bgColor}80` }}
          >
            <span style={{ color: estadoInfo.textColor }}>
              {estadoInfo.texto}
            </span>
          </div>
        </div>

        {/* Dirección (sin icono) */}
        <p className="item-reserva-direccion">
          {reserva.salon?.direccion || 'Dirección no disponible'}
        </p>

        {/* Fila de detalles: calendario */}
        <div className="item-reserva-detalle">
          <FiCalendar className="item-reserva-icono" />
          <span className="item-reserva-detalle-texto">{fechaFormateada}</span>
        </div>

        {/* Fila de detalles: hora */}
        <div className="item-reserva-detalle">
          <FiClock className="item-reserva-icono" />
          <span className="item-reserva-detalle-texto">
            {horaInicioFormateada} - {horaFinFormateada}
          </span>
        </div>

        {/* Fila de detalles: propietario */}
        <div className="item-reserva-detalle">
          <FiKey className="item-reserva-icono" />
          <span className="item-reserva-detalle-texto">
            Propietario: {reserva.salon?.publicador?.nombre || 'Usuario'} {reserva.salon?.publicador?.apellido || ''}
          </span>
        </div>

        {/* Monto */}
        <div className="item-reserva-footer">
          <div className="item-reserva-monto-container">
            <span className="item-reserva-monto">
              ${transaccion?.monto_pagado?.toLocaleString('es-CL') || '0'}
            </span>
            <span className="item-reserva-monto-label">total abonado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemReserva;