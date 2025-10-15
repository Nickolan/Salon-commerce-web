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
  
  const ingresoDetails = useMemo(() => {
    if (!selectedTransaccion) return null;

    // Paso 1: Encontrar la reserva asociada a la transacción
    const reserva = reservas.find(r => r.id_reserva === selectedTransaccion.reserva.id_reserva);
    if (!reserva) {
      return { error: `No se encontró la reserva con ID ${selectedTransaccion.reserva.id_reserva}` };
    }
    
    // Paso 2: Encontrar el salón de esa reserva
    const salon = salones.find(s => s.id_salon === reserva.id_salon);
    if (!salon) {
      return { error: `No se encontró el salón con ID ${reserva.id_salon}` };
    }

    // Paso 3: Encontrar al cliente (arrendatario) de la reserva
    const cliente = usuarios.find(u => u.id_usuario === reserva.id_arrendatario);
    
    // Paso 4: Encontrar al vendedor (publicador) del salón
    const vendedor = usuarios.find(u => u.id_usuario === salon.id_publicador);
    
    return {
      vendedor: vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Vendedor no encontrado',
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado',
      salon: salon.nombre,
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
          {ingresoDetails.error ? <p style={{color: 'red'}}>{ingresoDetails.error}</p> :
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
                <strong>Monto Extraído</strong>
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