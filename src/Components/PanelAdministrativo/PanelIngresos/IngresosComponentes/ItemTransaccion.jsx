import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { SiMercadopago } from "react-icons/si";
import './ItemTransaccion.css';

const formatId = (id) => {
  return String(id).padStart(8, '0');
};

// Función para tiempo relativo detallado (NUEVA)
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

const getEstadoColor = (estado) => {
  switch(estado?.toLowerCase()) {
    case 'aprobado':
      return '#55AB52';
    case 'pendiente':
      return '#787878';
    case 'rechazado':
    case 'reembolso':
      return '#AD1519';
    default:
      return '#787878';
  }
};

// Función para obtener CVU (solo últimos 4 dígitos)
const obtenerCvuResumido = (detallesPago) => {
  if (!detallesPago) return '**** **** **** 8901';
  
  let cvu = '';
  if (typeof detallesPago === 'string') {
    try {
      const parsed = JSON.parse(detallesPago);
      cvu = parsed?.cvu || parsed?.cbu || '';
    } catch (e) {}
  } else if (typeof detallesPago === 'object') {
    cvu = detallesPago?.cvu || detallesPago?.cbu || '';
  }
  
  if (cvu && cvu.length >= 4) {
    return `**** **** **** ${cvu.slice(-4)}`;
  }
  return '**** **** **** 8901';
};

const ItemTransaccion = ({
  transaccion,
  vendedor,
  cliente,
  isExpanded,
  onToggleExpand,
  onVerComprobante
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Obtener datos del salón desde la transacción
  const salon = transaccion.reserva?.salon;
  
  // Obtener hora_inicio y hora_fin de la reserva (NUEVO)
  const reserva = transaccion.reserva;
  const horaInicio = reserva?.hora_inicio || '--';
  const horaFin = reserva?.hora_fin || '--';
  
  // Obtener precio por hora del salón o calcularlo desde la reserva (NUEVO)
  const precioPorHora = salon?.precio_por_hora || 
    (reserva && horaInicio !== '--' && horaFin !== '--' 
      ? Math.round((transaccion.monto_pagado || 0) / 
          (parseInt(horaFin.split(':')[0]) - parseInt(horaInicio.split(':')[0]))) 
      : 0);

  // Formatear fecha y hora con espacio extra
  const fecha = transaccion.fecha_transaccion
    ? format(parseISO(transaccion.fecha_transaccion), 'dd-MM-yy')
    : '--';
  const hora = transaccion.fecha_transaccion
    ? format(parseISO(transaccion.fecha_transaccion), 'HH:mm')
    : '--';
  
  const fechaTransaccion = `${fecha}              ${hora}`;

  // Extraer CVU
  const cvuResumido = obtenerCvuResumido(transaccion.detalles_pago);

  return (
    <div className={`trans-item ${isExpanded ? 'trans-expanded' : ''}`}>
      {/* Fecha y hora con espacio extra */}
      <div className="trans-fecha-top">
        {fechaTransaccion}
      </div>

      {/* Estado */}
      <div
        className="trans-estado-badge"
        style={{ backgroundColor: getEstadoColor(transaccion.estado_transaccion) }}
      >
        {transaccion.estado_transaccion?.toUpperCase() || 'PENDIENTE'}
      </div>

      {/* Contenido principal - Grid 4 columnas con separadores verticales (DISEÑO ORIGINAL) */}
      <div className="trans-content">
        {/* COLUMNA 1: Dueño (Vendedor) */}
        <div className="trans-columna trans-dueno">
          <div className="trans-nombre-bold">
            {vendedor?.nombre || 'Vendedor'} {vendedor?.apellido || ''}
          </div>
          <div className="trans-email">
            {vendedor?.email || 'email@ejemplo.com'}
          </div>
        </div>

        {/* Icono >> centrado verticalmente entre col1 y col2 */}
        <div className="trans-double-arrow-container">
          <MdKeyboardDoubleArrowRight size={35} color="#C8AD7F" />
        </div>

        {/* COLUMNA 2: Salón */}
        <div className="trans-columna trans-salon">
            <div className="trans-salon-nombre">
                {salon?.nombre || 'Nombre del Salón'}
            </div>
            <div className="trans-cliente-info">
                <span className="trans-cliente-nombre">
                {cliente?.nombre || 'Cliente'} {cliente?.apellido || ''}
                </span>
            </div>
        </div>

        {/* Separador vertical 1 - más alto */}
        <div className="trans-divider"></div>

        {/* COLUMNA 3: Método de pago con icono MP */}
        <div className="trans-columna trans-pago">
          <div className="trans-pago-header">
            <SiMercadopago size={20} color="#009EE3" className="trans-mp-icon" />
            <span className="trans-metodo">Mercado Pago</span>
          </div>
          <div className="trans-cvu-container">
            <span className="trans-cvu-label">CVU</span>
            <span className="trans-cvu-valor">{cvuResumido}</span>
          </div>
        </div>

        {/* Separador vertical 2 - más alto */}
        <div className="trans-divider"></div>

        {/* COLUMNA 4: Montos */}
        <div className="trans-columna trans-montos-acciones">
          <div className="trans-montos-container">
            <div className="trans-monto-item">
              <span className="trans-monto-valor-bold">
                ${(transaccion.monto_pagado || 0).toLocaleString('es-CL')}
              </span>
              <span className="trans-monto-label">INGRESO TOTAL</span>
            </div>
            <div className="trans-monto-item">
              <span className="trans-monto-valor">
                ${((transaccion.monto_pagado || 0) * 0.1).toLocaleString('es-CL')}
              </span>
              <span className="trans-monto-label">COMISIÓN PROPIA</span>
            </div>
          </div>

          <div className="trans-acciones-container">
            <div
              className="trans-accion-icono"
              onClick={onToggleExpand}
              title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
            >
              {isExpanded ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>

            <div className="trans-accion-icono trans-menu-container" onClick={() => setShowMenu(!showMenu)}>
              <BsThreeDotsVertical size={20} />
              {showMenu && (
                <div className="trans-menu-desplegable">
                  <div className="trans-menu-item" onClick={onVerComprobante}>
                    Ver comprobante
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN EXPANDIBLE - SOLO ESTO CAMBIÓ */}
      {isExpanded && (
        <div className="trans-expanded-content">
          <div className="expanded-actividad-lista">
            
            {/* ITEM 1: Horario de la reserva */}
            <div className="expanded-actividad-item">
              <div className="expanded-actividad-texto">
                <span className="expanded-actividad-normal">La reserva se realizó desde las </span>
                <span className="expanded-actividad-destacado">{horaInicio}</span>
                <span className="expanded-actividad-normal"> hasta las </span>
                <span className="expanded-actividad-destacado">{horaFin}</span>
              </div>
              <div className="expanded-actividad-footer">
                <span className="expanded-actividad-id">Reserva #{formatId(reserva?.id_reserva || 0)}</span>
                <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(reserva?.fecha_creacion)}</span>
              </div>
              <div className="expanded-actividad-linea"></div>
            </div>

            {/* ITEM 2: Precio por hora */}
            <div className="expanded-actividad-item">
              <div className="expanded-actividad-texto">
                <span className="expanded-actividad-normal">El salón tiene un precio por hora de </span>
                <span className="expanded-actividad-destacado">${precioPorHora.toLocaleString('es-CL')}</span>
              </div>
              <div className="expanded-actividad-footer">
                <span className="expanded-actividad-id">Salón #{formatId(salon?.id_salon || 0)}</span>
                <span className="expanded-actividad-tiempo">{getRelativeTimeDetailed(salon?.fecha_creacion)}</span>
              </div>
              <div className="expanded-actividad-linea"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemTransaccion;