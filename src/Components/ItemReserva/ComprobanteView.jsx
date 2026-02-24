import React from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './ComprobanteView.css';

const ComprobanteView = ({ reserva, onClose }) => {
  if (!reserva) return null;

  const { salon, arrendatario, transacciones } = reserva;
  const transaccion = transacciones?.[0] || {};

  // Formatear fecha
  const fechaReserva = reserva.fecha_reserva 
    ? format(parseISO(reserva.fecha_reserva), 'dd/MM/yyyy')
    : 'No disponible';

  const fechaTransaccion = transaccion.fecha_transaccion
    ? format(parseISO(transaccion.fecha_transaccion), 'dd/MM/yyyy HH:mm')
    : 'No disponible';

  // Formatear ID con 8 dígitos
  const formattedId = reserva.id_reserva 
    ? String(reserva.id_reserva).padStart(8, '0') 
    : '00000000';

  return (
    <div className="comprobante-modal-overlay" onClick={onClose}>
      <div className="comprobante-modal" onClick={e => e.stopPropagation()}>
        <button className="comprobante-close" onClick={onClose}>×</button>
        
        <div className="comprobante-container">
          {/* Header sin logo */}
          <div className="comprobante-header">
            <h2>Comprobante de Reserva</h2>
            <p className="comprobante-numero">
              N° {formattedId}
            </p>
          </div>

          {/* Datos del Cliente */}
          <div className="comprobante-seccion">
            <h3>DATOS DEL CLIENTE</h3>
            <div className="comprobante-grid">
              <div className="comprobante-item">
                <span className="label">NOMBRE COMPLETO</span>
                <span className="value">
                  {arrendatario?.nombre || ''} {arrendatario?.apellido || ''}
                </span>
              </div>
              <div className="comprobante-item">
                <span className="label">DNI</span>
                <span className="value">{arrendatario?.dni || 'No especificado'}</span>
              </div>
              <div className="comprobante-item">
                <span className="label">EMAIL</span>
                <span className="value">{arrendatario?.email || ''}</span>
              </div>
            </div>
          </div>

          {/* Detalles del Salón */}
          <div className="comprobante-seccion">
            <h3>DETALLES DEL SALÓN</h3>
            <div className="comprobante-grid">
              <div className="comprobante-item full-width">
                <span className="label">NOMBRE DEL SALÓN</span>
                <span className="value">{salon?.nombre || ''}</span>
              </div>
              <div className="comprobante-item full-width">
                <span className="label">DIRECCIÓN</span>
                <span className="value">{salon?.direccion || ''}</span>
              </div>
              {salon?.descripcion && (
                <div className="comprobante-item full-width">
                  <span className="label">DESCRIPCIÓN</span>
                  <span className="value">{salon.descripcion}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="comprobante-seccion">
            <h3>DETALLES DE LA RESERVA</h3>
            <div className="comprobante-grid">
              <div className="comprobante-item">
                <span className="label">FECHA DE RESERVA</span>
                <span className="value">{fechaReserva}</span>
              </div>
              <div className="comprobante-item">
                <span className="label">HORA DE INICIO</span>
                <span className="value">{reserva.hora_inicio || ''}</span>
              </div>
              <div className="comprobante-item">
                <span className="label">HORA DE FIN</span>
                <span className="value">{reserva.hora_fin || ''}</span>
              </div>
            </div>
          </div>

          {/* Detalles del Pago */}
          <div className="comprobante-seccion">
            <h3>DETALLES DEL PAGO</h3>
            <table className="comprobante-tabla">
              <thead>
                <tr>
                  <th>CONCEPTO</th>
                  <th>DETALLE</th>
                  <th>MONTO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monto Pagado</td>
                  <td>Alquiler del salón</td>
                  <td className="monto">${transaccion.monto_pagado?.toLocaleString('es-CL') || '0'}</td>
                </tr>
                <tr>
                  <td>Método de Pago</td>
                  <td colSpan="2">{transaccion.metodo_pago || 'Mercado Pago'}</td>
                </tr>
                {transaccion.detalles_pago && (
                  <tr>
                    <td>Detalles</td>
                    <td colSpan="2">{transaccion.detalles_pago}</td>
                  </tr>
                )}
                <tr>
                  <td>Fecha de Pago</td>
                  <td colSpan="2">{fechaTransaccion}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="comprobante-footer">
            <p className="aviso-legal">
              ⬜ Aviso Legal: Este comprobante valida el uso del servicio contratado a través de la plataforma. Para facturación o reclamos, contacte a soporte.
            </p>
            <div className="footer-info">
              <p>RAZÓN SOCIAL Focus Room S.A.</p>
              <p>EMAIL DE SOPORTE soporte@focusroom.com</p>
              <p>SITIO WEB www.focusroom.com</p>
            </div>
            <p className="copyright">© 2026 Focus Room. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprobanteView;