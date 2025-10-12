import React from 'react';
import "./DatosDelPago.css";
import Transacciones from "../../../utils/Transacciones.json";
import Reservas from "../../../utils/Reservas.json";
import Salones from "../../../utils/Salones.json";

const DatosDelPago = ({ reservaId, onClose }) => {
  const reserva = Reservas.find(r => r.id_reserva === reservaId);
  const transaccion = Transacciones.find(t => t.reserva.id_reserva === reservaId);
  const salon = Salones.find(s => s.id_salon === reserva?.id_salon);

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(monto);
  };

  const tieneTransaccion = !!transaccion;

  return (
    <div className='datos-pago-sidebar'>
      <div className='sidebar-content'>
        <div className='sidebar-header'>
          <h2>Detalle del Pago</h2>
          <button className='close-button' onClick={onClose}>×</button>
        </div>
        
        <div className='info-superior'>
          <span className='fecha'>{reserva ? formatearFecha(reserva.fecha_creacion) : 'Fecha no disponible'}</span>
          {tieneTransaccion && (
            <>
              <span className='separador'> | </span>
              <span className='transaccion'>#{transaccion.id_transaccion}</span>
            </>
          )}
        </div>

        <div className='linea-separadora-central'></div>

        {tieneTransaccion ? (
          <>
            <div className='detalles-pago'>
              <div className='detalle-item servicio'>
                <span className='detalle-label'>Servicio</span>
                <span className='detalle-valor'>{formatearMoneda(transaccion.monto_pagado)}</span>
              </div>
              
              <div className='metodo-pago-derecha'>
                <span className='metodo-texto'>{transaccion.metodo_pago}</span>
              </div>
              
              <div className='detalle-item total'>
                <span className='detalle-label'>Total Pagado</span>
                <span className='detalle-valor'>{formatearMoneda(transaccion.monto_pagado)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className='sin-transaccion'>
            <p>No se encontró información de pago para esta reserva.</p>
            <p>La reserva puede estar pendiente de pago o no tener transacción asociada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatosDelPago;