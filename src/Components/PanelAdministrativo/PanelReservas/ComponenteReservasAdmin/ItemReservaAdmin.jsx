import React from 'react';
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiClock, FiDollarSign, FiEye, FiEyeOff } from "react-icons/fi";
import './ItemReservaAdmin.css';

const ItemReservaAdmin = ({ reserva, precio, isExpanded, onToggleExpand, esReservaFutura, estadoPago }) => {
  // Función para formatear ID con 8 dígitos
  const formatId = (id) => {
    return String(id).padStart(8, '0');
  };

  // Función para tiempo relativo detallado
  const getRelativeTimeDetailed = (dateString) => {
    if (!dateString) return 'Sin actividad';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffMinutes < 60) {
        return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
      } else if (diffHours < 24) {
        return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      } else if (diffDays < 7) {
        return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
      } else if (diffWeeks < 4) {
        return `Hace ${diffWeeks} ${diffWeeks === 1 ? 'semana' : 'semanas'}`;
      } else {
        return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
      }
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para obtener la URL de la imagen
  const getImagenSalon = () => {
    try {
      if (!reserva.salon) {
        return 'https://via.placeholder.com/195x106?text=Salón';
      }

      if (typeof reserva.salon === 'object' && reserva.salon !== null) {
        if (Array.isArray(reserva.salon.fotos) && reserva.salon.fotos.length > 0) {
          return reserva.salon.fotos[0];
        }
        
        if (typeof reserva.salon.fotos === 'string' && reserva.salon.fotos) {
          if (reserva.salon.fotos.startsWith('http')) {
            return reserva.salon.fotos;
          }
          
          if (reserva.salon.fotos.includes(',')) {
            const fotosArray = reserva.salon.fotos.split(',').map(f => f.trim());
            return fotosArray[0];
          }
        }

        if (reserva.salon.foto_portada) {
          return reserva.salon.foto_portada;
        }
      }

      return 'https://via.placeholder.com/195x106?text=Salón';
    } catch (error) {
      console.error('Error procesando imagen:', error);
      return 'https://via.placeholder.com/195x106?text=Salón';
    }
  };

  // Función para obtener la foto de perfil del usuario
  const getFotoPerfil = () => {
    try {
      if (!reserva.arrendatario) {
        return 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp';
      }

      if (reserva.arrendatario.foto_perfil) {
        const foto = reserva.arrendatario.foto_perfil;
        
        if (foto.startsWith('http')) {
          return foto;
        }
        
        if (foto.startsWith('/')) {
          return `http://localhost:3000${foto}`;
        }
        
        return `http://localhost:3000/uploads/usuarios/${foto}`;
      }

      if (reserva.arrendatario.foto) {
        return reserva.arrendatario.foto;
      }

      return 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp';
    } catch (error) {
      console.error('Error procesando foto de perfil:', error);
      return 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp';
    }
  };

  // Fecha de creación (esquina superior izquierda)
  const fechaCreacionFormateada = reserva.fecha_creacion
    ? format(parseISO(reserva.fecha_creacion), 'dd-MM-yyyy')
    : 'Fecha no disponible';

  // Fecha de la reserva (para los detalles)
  const fechaReservaFormateada = reserva.fecha_reserva
    ? format(parseISO(reserva.fecha_reserva), 'dd-MM-yyyy')
    : 'Fecha no disponible';

  // Obtener ubicación
  const getUbicacion = (direccion) => {
    if (!direccion) return 'Ubicación no disponible';
    const partes = direccion.split(',');
    if (partes.length > 1) {
      return partes.slice(1).join(',').trim();
    }
    return direccion;
  };

  // Función para obtener color del estado
  const getEstadoColor = (estado) => {
    const colores = {
      'aprobado': '#55AB52',
      'aceptado': '#55AB52',
      'confirmada': '#55AB52',
      'pendiente': '#787878',
      'creada': '#787878',
      'rechazado': '#AD1519',
      'rechazada': '#AD1519',
      'cancelada': '#AD1519',
      'completada': '#787878'
    };
    return colores[estado?.toLowerCase()] || '#787878';
  };

  const getPrecioReserva = () => {
    if (precio && precio > 0) {
      return precio;
    }

    if (reserva.transacciones && reserva.transacciones.length > 0) {
      const transaccionesOrdenadas = [...reserva.transacciones].sort(
        (a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion)
      );
      const monto = transaccionesOrdenadas[0]?.monto_pagado;
      return monto || 0;
    }

    if (reserva.transaccion) {
      return reserva.transaccion.monto_pagado || 0;
    }

    return 0;
  };

  // Obtener la transacción asociada
  const transaccion = reserva.transacciones && reserva.transacciones.length > 0 ? reserva.transacciones[0] : null;

  // Obtener la reseña asociada (si existe)
  const resenia = reserva.resenias && reserva.resenias.length > 0 ? reserva.resenias[0] : null;

  return (
    <div className={`item-reserva-admin ${isExpanded ? 'expanded' : ''}`}>
      {/* Fecha de creación en esquina superior izquierda */}
      <div className="reserva-fecha-top">
        {fechaCreacionFormateada}
      </div>

      {/* Estado en esquina superior derecha */}
      <div
        className="reserva-estado-badge"
        style={{ backgroundColor: getEstadoColor(reserva.estado_reserva) }}
      >
        {reserva.estado_reserva}
      </div>

      {/* Contenido principal - EN FILA */}
      <div className="reserva-content">
        {/* Imagen */}
        <div className="reserva-imagen-wrapper">
          <img
            src={getImagenSalon()}
            alt={reserva.salon?.nombre || 'Salón'}
            className="reserva-imagen"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/195x106?text=Salón';
            }}
          />
        </div>

        {/* Info del salón */}
        <div className="info-salon-wrapper">
          <h3 className="salon-nombre">{reserva.salon?.nombre || 'Salón sin nombre'}</h3>
          <p className="salon-ubicacion">{getUbicacion(reserva.salon?.direccion)}</p>
          <p className="salon-anfitrion">Por: {reserva.salon?.publicador?.nombre || 'Anfitrión'}</p>
        </div>

        {/* Separador vertical */}
        <div className="separador-vertical"></div>

        {/* Info del cliente */}
        <div className="cliente-wrapper">
          <div className="cliente-avatar">
            <img
              src={getFotoPerfil()}
              alt={reserva.arrendatario?.nombre}
              onError={(e) => {
                e.target.src = 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp';
              }}
            />
          </div>
          <div className="cliente-detalles">
            <p className="cliente-nombre">{reserva.arrendatario?.nombre || 'Cliente'} {reserva.arrendatario?.apellido || ''}</p>
            <p className="cliente-email">{reserva.arrendatario?.email || 'email@ejemplo.com'}</p>
            <p className="cliente-telefono">{reserva.arrendatario?.telefono || 'Teléfono no disponible'}</p>
          </div>
        </div>

        {/* Separador vertical derecho */}
        <div className="separador-vertical-derecho"></div>

        {/* Detalles de reserva */}
        <div className="reserva-detalles-wrapper">
          <div className="detalle-item">
            <FiCalendar className="detalle-icono" />
            <span className="detalle-texto">{fechaReservaFormateada}</span>
          </div>
          <div className="detalle-item">
            <FiClock className="detalle-icono" />
            <span className="detalle-texto">{reserva.hora_inicio} - {reserva.hora_fin}</span>
          </div>
          <div className="detalle-item">
            <FiDollarSign className="detalle-icono" />
            <span className="detalle-texto">
              {typeof getPrecioReserva() === 'number'
                ? `$${getPrecioReserva()}`
                : getPrecioReserva()}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="acciones-wrapper">
          <div className="accion-icono" onClick={onToggleExpand} title={isExpanded ? "Ocultar detalles" : "Ver detalles"}>
            {isExpanded ? <FiEyeOff size={20} color="#2D241E" /> : <FiEye size={20} color="#2D241E" />}
          </div>
        </div>
      </div>

      {/* SECCIÓN EXPANDIBLE - CON LA MISMA ESTRUCTURA QUE USER CARD */}
      {isExpanded && (
        <div className="reserva-expanded-content">
          <div className="expanded-actividad-lista">
            
            {/* ITEM 1: Detalles del Salón */}
            <div className="expanded-actividad-item">
              <div className="expanded-actividad-texto">
                <span className="expanded-actividad-destacado">{reserva.salon?.nombre || 'Salón'}</span>
                <span className="expanded-actividad-normal"> tiene un precio por hora de </span>
                <span className="expanded-actividad-destacado">${reserva.salon?.precio_por_hora || 0}</span>
              </div>
              <div className="expanded-actividad-footer">
                <span className="expanded-actividad-id">Salón #{formatId(reserva.salon?.id_salon || 0)}</span>
                <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(reserva.fecha_creacion)}</span>
              </div>
              <div className="expanded-actividad-linea"></div>
            </div>

            {/* ITEM 2: Detalles del Pago (si existe transacción) */}
            {transaccion && (
              <div className="expanded-actividad-item">
                <div className="expanded-actividad-texto">
                  <span className="expanded-actividad-normal">Se ha confirmado la reserva mediante </span>
                  <span className="expanded-actividad-destacado">{transaccion.detalles_pago || 'Mercado Pago'}</span>
                </div>
                <div className="expanded-actividad-footer">
                  <span className="expanded-actividad-id">Transacción #{formatId(transaccion.id_transaccion)}</span>
                  <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(transaccion.fecha_transaccion)}</span>
                </div>
                <div className="expanded-actividad-linea"></div>
              </div>
            )}

            {/* ITEM 3: Reseña (si existe) */}
            {resenia && (
              <div className="expanded-actividad-item">
                <div className="expanded-actividad-texto">
                  <span className="expanded-actividad-destacado">{reserva.arrendatario?.nombre || 'Usuario'}</span>
                  <span className="expanded-actividad-normal"> dio una calificación de </span>
                  <span className="expanded-actividad-destacado">{resenia.calificacion} estrellas</span>
                </div>
                <div className="expanded-actividad-texto" style={{ marginTop: '4px', marginBottom: '4px' }}>
                  <span className="expanded-actividad-normal">"</span>
                  <span className="expanded-actividad-destacado">{resenia.comentario}</span>
                  <span className="expanded-actividad-normal">"</span>
                </div>
                <div className="expanded-actividad-footer">
                  <span className="expanded-actividad-id">Reseña #{formatId(resenia.id_resenia)}</span>
                  <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(resenia.fecha_creacion)}</span>
                </div>
                <div className="expanded-actividad-linea"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemReservaAdmin;