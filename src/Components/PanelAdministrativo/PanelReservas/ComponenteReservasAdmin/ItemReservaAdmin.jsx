import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { FiCalendar, FiClock, FiDollarSign, FiUser, FiHome, FiMapPin, FiEye, FiEyeOff, FiCreditCard, FiCheckCircle, FiXCircle, FiClock as FiPending } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import './ItemReservaAdmin.css';

const ItemReservaAdmin = ({ reserva, precio, isExpanded, onToggleExpand, onCancelar, esReservaFutura, estadoPago, }) => {
  const [showMenu, setShowMenu] = useState(false);
    console.log('🎨 Renderizando ItemReservaAdmin:', {
    id: reserva.id_reserva,
    fecha: reserva.fecha_reserva,
    salon: reserva.salon?.nombre,
    estado: reserva.estado_reserva
  });

  // Formatear fecha
  const fechaFormateada = reserva.fecha_reserva 
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

  // Función para obtener icono de estado de transacción
  const getTransaccionIcono = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'aprobado': return <FiCheckCircle color="#55AB52" />;
      case 'rechazado': return <FiXCircle color="#AD1519" />;
      case 'pendiente': return <FiPending color="#787878" />;
      case 'reembolso': return <FiDollarSign color="#FFA500" />; 
      default: return <FiDollarSign color="#787878" />;
    }
  };
  
  const getPrecioReserva = () => {
    // Si tenemos precio por prop y es mayor a 0, lo usamos
    if (precio && precio > 0) {
      return precio;
    }
    
    // Si hay transacciones en la reserva, usamos el monto
    if (reserva.transacciones && reserva.transacciones.length > 0) {
      const transaccionesOrdenadas = [...reserva.transacciones].sort(
        (a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion)
      );
      const monto = transaccionesOrdenadas[0].monto_pagado;
      return monto || 0;
    }
    
    // Si hay transacción singular
    if (reserva.transaccion) {
      return reserva.transaccion.monto_pagado || 0;
    }

    // Verificar si es reserva futura
    const fechaReserva = new Date(reserva.fecha_reserva);
    const hoy = new Date();
    if (fechaReserva > hoy) {
      return 'Pendiente';  // 👈 Retorna string para reservas futuras
    }

    return 0;
  };

  // Determinar si se puede cancelar
  const puedeCancelar = !['completada', 'cancelada', 'rechazada'].includes(reserva.estado_reserva?.toLowerCase());

  // Obtener la transacción asociada
  const transaccion = reserva.transacciones && reserva.transacciones.length > 0 ? reserva.transacciones[0] : null;

  return (
    <div className={`item-reserva-admin ${isExpanded ? 'expanded' : ''}`}>
      {/* Fecha en esquina superior izquierda */}
      <div className="reserva-fecha-top">
        {fechaFormateada}
      </div>

      {/* Estado en esquina superior derecha */}
      <div 
        className="reserva-estado-badge" 
        style={{ backgroundColor: getEstadoColor(reserva.estado_reserva) }}
      >
        {reserva.estado_reserva}
      </div>

      {/* Contenido principal */}
      <div className="reserva-content">
        {/* Imagen */}
        <div className="reserva-imagen-wrapper">
          <img 
            src={reserva.salon?.fotos?.[0] || 'https://via.placeholder.com/195x106'} 
            alt={reserva.salon?.nombre}
            className="reserva-imagen"
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
              src={reserva.arrendatario?.foto_perfil || 'https://storyblok-cdn.photoroom.com/f/191576/1200x800/a3640fdc4c/profile_picture_maker_before.webp'} 
              alt={reserva.arrendatario?.nombre}
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
            <span className="detalle-texto">{fechaFormateada}</span>
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
          {/* Botón Ver/Ocultar detalles */}
          <div className="accion-icono" onClick={onToggleExpand} title={isExpanded ? "Ocultar detalles" : "Ver detalles"}>
            {isExpanded ? <FiEyeOff size={20} color="#2D241E" /> : <FiEye size={20} color="#2D241E" />}
          </div>
          
          {/* Menú de 3 puntos (solo si se puede cancelar) */}
          {puedeCancelar && (
            <div className="accion-icono menu-container" onClick={() => setShowMenu(!showMenu)}>
              <BsThreeDotsVertical size={20} color="#2D241E" />
              {showMenu && (
                <div className="menu-desplegable">
                  <div className="menu-item" onClick={() => onCancelar(reserva)}>Cancelar/Rechazar reserva</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sección expandible con historial detallado */}
      {isExpanded && (
        <div className="reserva-historial">
          <h4 className="historial-titulo">Historial de la reserva</h4>
          
          <div className="historial-grid">
            {/* Información de la reserva */}
            <div className="historial-seccion">
              <h5 className="historial-seccion-titulo">Detalles de la Reserva</h5>
              <div className="historial-item">
                <span className="historial-label">ID Reserva:</span>
                <span className="historial-valor">#{reserva.id_reserva}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Fecha de creación:</span>
                <span className="historial-valor">{format(parseISO(reserva.fecha_creacion), 'dd/MM/yyyy HH:mm')}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Estado actual:</span>
                <span className="historial-valor" style={{ color: getEstadoColor(reserva.estado_reserva) }}>
                  {reserva.estado_reserva}
                </span>
              </div>
            </div>

            {/* Información del salón */}
            <div className="historial-seccion">
              <h5 className="historial-seccion-titulo">Detalles del Salón</h5>
              <div className="historial-item">
                <span className="historial-label">ID Salón:</span>
                <span className="historial-valor">#{reserva.salon?.id_salon}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Nombre:</span>
                <span className="historial-valor">{reserva.salon?.nombre}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Capacidad:</span>
                <span className="historial-valor">{reserva.salon?.capacidad} personas</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Precio por hora:</span>
                <span className="historial-valor">${reserva.salon?.precio_por_hora}</span>
              </div>
              <div className="historial-item">
                <span className="historial-label">Dirección:</span>
                <span className="historial-valor">{reserva.salon?.direccion}</span>
              </div>
            </div>

            {/* Información de la transacción */}
            {transaccion && (
              <div className="historial-seccion">
                <h5 className="historial-seccion-titulo">Detalles del Pago</h5>
                <div className="historial-item">
                  <span className="historial-label">ID Transacción:</span>
                  <span className="historial-valor">#{transaccion.id_transaccion}</span>
                </div>
                <div className="historial-item">
                  <span className="historial-label">Monto pagado:</span>
                  <span className="historial-valor">${transaccion.monto_pagado}</span>
                </div>
                <div className="historial-item">
                  <span className="historial-label">Método de pago:</span>
                  <span className="historial-valor">{transaccion.metodo_pago}</span>
                </div>
                <div className="historial-item">
                  <span className="historial-label">Estado del pago:</span>
                  <span className="historial-valor" style={{ 
                    color: transaccion.estado_transaccion?.toLowerCase() === 'aprobado' ? '#55AB52' : 
                          transaccion.estado_transaccion?.toLowerCase() === 'rechazado' ? '#AD1519' :
                          transaccion.estado_transaccion?.toLowerCase() === 'reembolso' ? '#FFA500' : '#787878'
                  }}>
                    {getTransaccionIcono(transaccion.estado_transaccion)} {transaccion.estado_transaccion}
                  </span>
                </div>
                <div className="historial-item">
                  <span className="historial-label">Fecha del pago:</span>
                  <span className="historial-valor">{format(parseISO(transaccion.fecha_transaccion), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                {transaccion.detalles_pago && (
                  <div className="historial-item">
                    <span className="historial-label">Detalles:</span>
                    <span className="historial-valor">{transaccion.detalles_pago}</span>
                  </div>
                )}
              </div>
            )}

            {/* Equipamiento del salón (si existe) */}
            {reserva.salon?.equipamientos && reserva.salon.equipamientos.length > 0 && (
              <div className="historial-seccion">
                <h5 className="historial-seccion-titulo">Equipamiento</h5>
                <div className="historial-equipamientos">
                  {reserva.salon.equipamientos.map((equipo, index) => (
                    <span key={index} className="equipamiento-tag">{equipo}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Reglas del salón (si existe) */}
            {reserva.salon?.reglas && reserva.salon.reglas.length > 0 && (
              <div className="historial-seccion">
                <h5 className="historial-seccion-titulo">Reglas</h5>
                <ul className="historial-reglas">
                  {reserva.salon.reglas.map((regla, index) => (
                    <li key={index}>{regla}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemReservaAdmin;