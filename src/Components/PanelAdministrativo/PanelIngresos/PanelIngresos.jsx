import React, { useState, useMemo } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

const PanelIngresos = ({ transacciones, reservas, salones, usuarios }) => {
  const [selectedTransaccion, setSelectedTransaccion] = useState(null);

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(number);
  };
  
  // Este es el proceso más complejo, lo encapsulamos con useMemo para eficiencia
  const ingresoDetails = useMemo(() => {
    if (!selectedTransaccion) return null;

    const reservaDeTransaccion = reservas.find(r => r.id_reserva === selectedTransaccion.reserva.id_reserva);
    if (!reservaDeTransaccion) return { error: "No se encontró la reserva asociada." };
    
    const salonDeReserva = salones.find(s => s.id_salon === reservaDeTransaccion.id_salon);
    if (!salonDeReserva) return { error: "No se encontró el salón asociado." };

    const cliente = usuarios.find(u => u.id_usuario === reservaDeTransaccion.id_arrendatario);
    const vendedor = usuarios.find(u => u.id_usuario === salonDeReserva.id_publicador);
    
    return {
      vendedor: vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'No encontrado',
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado',
      salon: salonDeReserva.nombre,
      montoPropio: selectedTransaccion.monto_pagado * 0.10, // 10% de comisión
    };

  }, [selectedTransaccion, reservas, salones, usuarios]);

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Ingresos</h2>
      <SearchbarAdmin
        items={transacciones}
        onSelect={setSelectedTransaccion}
        placeholder="Buscar por ID de transacción..."
        displayKey="id_transaccion"
      />

      {selectedTransaccion && ingresoDetails && (
        <div className="details-container">
          {ingresoDetails.error ? <p>{ingresoDetails.error}</p> :
            <>
              <div className="detail-item">
                <strong>ID de la Transacción</strong>
                <span>{selectedTransaccion.id_transaccion}</span>
              </div>
              <div className="detail-item">
                <strong>Vendedor</strong>
                <span>{ingresoDetails.vendedor}</span>
              </div>
              <div className="detail-item">
                <strong>Cliente</strong>
                <span>{ingresoDetails.cliente}</span>
              </div>
              <div className="detail-item">
                <strong>Sala Reservada</strong>
                <span>{ingresoDetails.salon}</span>
              </div>
              <div className="detail-item">
                <strong>Estado</strong>
                <span>{selectedTransaccion.estado_transaccion}</span>
              </div>
              <div className="detail-item">
                <strong>Monto Total</strong>
                <span>{formatCurrency(selectedTransaccion.monto_pagado)}</span>
              </div>
              <div className="detail-item">
                <strong>Monto Propio (10%)</strong>
                <span>{formatCurrency(ingresoDetails.montoPropio)}</span>
              </div>
              <div className="detail-item">
                <strong>Método de Pago</strong>
                <span>{selectedTransaccion.metodo_pago}</span>
              </div>
            </>
          }
        </div>
      )}
    </div>
  );
};

export default PanelIngresos;