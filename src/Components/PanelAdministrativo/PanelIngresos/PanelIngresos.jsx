import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

// Helper function to format the month string
const formatDisplayMonth = (yyyyMm) => { 
   const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; 
    const [year, monthIndex] = yyyyMm.split('-').map(Number); 
    return `${monthNames[monthIndex - 1]} ${year}`; 
};

const PanelIngresos = ({ transacciones, reservas, salones, usuarios, selectedMonth }) => { 
  const [selectedTransaccion, setSelectedTransaccion] = useState(null); 

  useEffect(() => { 
    // Deselect if the current transaction is not in the new list
    if (selectedTransaccion && !transacciones.find(t => t.id_transaccion === selectedTransaccion.id_transaccion)) { 
        setSelectedTransaccion(null); 
    }
  }, [transacciones, selectedTransaccion]); 

  // Helper function to format currency
  const formatCurrency = (number) => { 
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(number); 
  };

  // Calculate details for the selected transaction using useMemo
  const ingresoDetails = useMemo(() => { 
    if (!selectedTransaccion) return null; 

    console.log("RESERVA",selectedTransaccion.reserva);
    
    // Find the associated reservation
    const reserva = selectedTransaccion.reserva
    console.log(reserva);
    
    if (!reserva) return { error: `No se encontró la reserva con ID ${selectedTransaccion.reserva.id_reserva}` }; 
    // Find the associated salon
    const salon = reserva.salon // 
    if (!salon) return { error: `No se encontró el salón con ID ${reserva.id_salon}` }; // 
    // Find the client (renter)
    const cliente = reserva.arrendatario; // 
    // Find the vendor (publisher)
    const vendedor = salon.publicador; // 
    return { // 
      // Format vendor name or show 'No encontrado'
      vendedor: vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'No encontrado', // 
      // Format client name or show 'No encontrado'
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado', // 
      // Get salon name
      salon: salon.nombre, // 
      // Calculate platform's earning (10%)
      montoPropio: selectedTransaccion.monto_pagado * 0.10, // 
    };
  }, [selectedTransaccion, reservas, salones, usuarios]); 

  return (
    <div className="admin-panel"> 
      <h2 className="panel-title">Ingresos ({formatDisplayMonth(selectedMonth)})</h2> 
      <SearchbarAdmin // 
        items={transacciones} // 
        onSelect={setSelectedTransaccion} // 
        placeholder="Buscar por ID de transacción..." // 
        displayKey="id_transaccion" // 
      />

      {/* Display transaction details if available and one is selected */}
      {transacciones.length > 0 && selectedTransaccion && ( // 
        <div className="details-container"> 
          {/* Show error if related data wasn't found */}
          {ingresoDetails.error ? <p style={{color: 'red'}}>{ingresoDetails.error}</p> : // 
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

      {/* Message when no transactions are found */}
      {transacciones.length === 0 && ( // 
        <p>No se encontraron transacciones para el mes seleccionado.</p> // 
      )}
    </div>
  );
};

export default PanelIngresos;