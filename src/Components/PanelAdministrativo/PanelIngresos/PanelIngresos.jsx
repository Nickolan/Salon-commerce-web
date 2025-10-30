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

  const transaccionesAprobadas = useMemo(() => {
    if (!transacciones) return [];
    return transacciones.filter(t => t.estado_transaccion === 'aprobado');
  }, [transacciones]); 

  useEffect(() => { 
    if (selectedTransaccion && !transaccionesAprobadas.find(t => t.id_transaccion === selectedTransaccion.id_transaccion)) { 
        setSelectedTransaccion(null); 
    }
  }, [transaccionesAprobadas, selectedTransaccion]); 

  const formatCurrency = (number) => { 
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(number); 
  };

  // --- LÓGICA CORREGIDA AQUÍ ---
  const ingresoDetails = useMemo(() => { 
    if (!selectedTransaccion) return null; 

    // 1. Obtenemos los IDs directamente de 'detalles_pago' (según tu JSON de backend)
    const idSalonAsociado = selectedTransaccion.detalles_pago?.id_salon;
    const idClienteAsociado = selectedTransaccion.detalles_pago?.id_arrendatario;

    // 2. Verificamos que existan
    if (!idSalonAsociado) {
      return { error: `La transacción ${selectedTransaccion.id_transaccion} no tiene un id_salon en detalles_pago.` };
    }
    if (!idClienteAsociado) {
      return { error: `La transacción ${selectedTransaccion.id_transaccion} no tiene un id_arrendatario en detalles_pago.` };
    }

    // 3. Buscamos el salón en la lista completa de 'salones' (la prop)
    const salon = salones.find(s => s.id_salon === idSalonAsociado);
    if (!salon) return { error: `No se encontró el salón con ID ${idSalonAsociado}` }; 
    
    // 4. Buscamos al cliente en la lista completa de 'usuarios' (la prop)
    const cliente = usuarios.find(u => u.id_usuario === idClienteAsociado);
    if (!cliente) return { error: `No se encontró el cliente con ID ${idClienteAsociado}` };
    
    // 5. Buscamos al vendedor (publicador) usando el salón que encontramos
    const vendedor = usuarios.find(u => u.id_usuario === salon.publicador.id_usuario);
    if (!vendedor) return { error: `No se encontró el vendedor (publicador) con ID ${salon.publicador.id_usuario}`};
    
    return { 
      vendedor: `${vendedor.nombre} ${vendedor.apellido}`, 
      cliente: `${cliente.nombre} ${cliente.apellido}`, 
      salon: salon.nombre, 
      montoPropio: selectedTransaccion.monto_pagado * 0.10, 
    };
  }, [selectedTransaccion, salones, usuarios]); // Ya no dependemos de 'reservas'

  return (
    <div className="admin-panel"> 
      <h2 className="panel-title">Ingresos ({formatDisplayMonth(selectedMonth)})</h2> 
      <SearchbarAdmin
        items={transaccionesAprobadas} 
        onSelect={setSelectedTransaccion} 
        placeholder="Buscar por ID de transacción..." 
        displayKey="id_transaccion" 
      />

      {transaccionesAprobadas.length > 0 && selectedTransaccion && ( 
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

      {transaccionesAprobadas.length === 0 && ( 
        <p>No se encontraron ingresos (transacciones aprobadas) para el mes seleccionado.</p> 
      )}
    </div>
  );
};

export default PanelIngresos;

