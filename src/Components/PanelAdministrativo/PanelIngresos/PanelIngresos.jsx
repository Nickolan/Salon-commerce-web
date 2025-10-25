import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

const formatDisplayMonth = (yyyyMm) => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const [year, monthIndex] = yyyyMm.split('-').map(Number);
    return `${monthNames[monthIndex - 1]} ${year}`;
};

const PanelIngresos = ({ transacciones, reservas, salones, usuarios, selectedMonth }) => {
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);

  useEffect(() => {
    if (selectedTransaccion && !transacciones.find(t => t.id_transaccion === selectedTransaccion.id_transaccion)) {
        setSelectedTransaccion(null);
    }
  }, [transacciones, selectedTransaccion]);

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(number);
  };
  
  const ingresoDetails = useMemo(() => {
    if (!selectedTransaccion) return null;
    const reserva = reservas.find(r => r.id_reserva === selectedTransaccion.reserva.id_reserva);
    if (!reserva) return { error: `No se encontró la reserva con ID ${selectedTransaccion.reserva.id_reserva}` };
    const salon = salones.find(s => s.id_salon === reserva.id_salon);
    if (!salon) return { error: `No se encontró el salón con ID ${reserva.id_salon}` };
    const cliente = usuarios.find(u => u.id_usuario === reserva.id_arrendatario);
    const vendedor = usuarios.find(u => u.id_usuario === salon.id_publicador);
    return {
      vendedor: vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'No encontrado',
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado',
      salon: salon.nombre,
      montoPropio: selectedTransaccion.monto_pagado * 0.10,
    };
  }, [selectedTransaccion, reservas, salones, usuarios]);

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Ingresos ({formatDisplayMonth(selectedMonth)})</h2>
      <SearchbarAdmin
        items={transacciones}
        onSelect={setSelectedTransaccion}
        placeholder="Buscar por ID de transacción..."
        displayKey="id_transaccion"
      />

      {transacciones.length > 0 && selectedTransaccion && (
        <div className="details-container">
          {ingresoDetails.error ? <p style={{color: 'red'}}>{ingresoDetails.error}</p> :
            <>
              <div className="detail-item"><strong>ID Transacción</strong><span>{selectedTransaccion.id_transaccion}</span></div>
              <div className="detail-item"><strong>Vendedor</strong><span>{ingresoDetails.vendedor}</span></div>
              <div className="detail-item"><strong>Cliente</strong><span>{ingresoDetails.cliente}</span></div>
              <div className="detail-item"><strong>Sala Reservada</strong><span>{ingresoDetails.salon}</span></div>
              <div className="detail-item"><strong>Estado</strong><span>{selectedTransaccion.estado_transaccion}</span></div>
              <div className="detail-item"><strong>Monto Total</strong><span>{formatCurrency(selectedTransaccion.monto_pagado)}</span></div>
              <div className="detail-item"><strong>Monto Propio (10%)</strong><span>{formatCurrency(ingresoDetails.montoPropio)}</span></div>
              <div className="detail-item"><strong>Método de Pago</strong><span>{selectedTransaccion.metodo_pago}</span></div>
            </>
          }
        </div>
      )}
      
      {transacciones.length === 0 && (
        <p>No se encontraron transacciones para el mes seleccionado.</p>
      )}
    </div>
  );
};

export default PanelIngresos;