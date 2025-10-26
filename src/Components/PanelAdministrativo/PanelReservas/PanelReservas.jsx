import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

// Helper function to format the month string
const formatDisplayMonth = (yyyyMm) => { //
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; //
    const [year, monthIndex] = yyyyMm.split('-').map(Number); //
    return `${monthNames[monthIndex - 1]} ${year}`; //
};

const PanelReservas = ({ reservas, salones, usuarios, selectedMonth }) => { //
  console.log(usuarios);
  
  const [selectedReserva, setSelectedReserva] = useState(null); //

  useEffect(() => { //
     // Deselect if the current reservation is not in the new list
     if (selectedReserva && !reservas.find(r => r.id_reserva === selectedReserva.id_reserva)) { //
          setSelectedReserva(null); //
      }
  }, [reservas, selectedReserva]); //

  const handleSelectReserva = (reserva) => { //
    setSelectedReserva(reserva); //
  };

  // Find related client and salon details using useMemo
  const reservaDetails = useMemo(() => { //
    if (!selectedReserva) return null; //
    // Find client by ID
    const cliente = usuarios.find(u => u.id_usuario === selectedReserva.id_arrendatario); //
    // Find salon by ID
    const salon = salones.find(s => s.id_salon === selectedReserva.id_salon); //
   return { //
      // Format client name or show 'No encontrado'
      clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado', //
      // Get salon name or show 'No encontrado'
      salonNombre: salon ? salon.nombre : 'No encontrado', //
      // Get salon location/address or show 'No encontrada'
      salonDireccion: salon ? salon.ubicacion : 'No encontrada', //
    };
  }, [selectedReserva, usuarios, salones]); // Dependencies for recalculation

  return (
    <div className="admin-panel"> {/* */}
      <h2 className="panel-title">Reservas ({formatDisplayMonth(selectedMonth)})</h2> {/* */}
      <SearchbarAdmin //
        items={reservas} //
        onSelect={handleSelectReserva} //
        placeholder="Buscar por ID de reserva..." //
        displayKey="id_reserva" //
      />

      {/* Display reservation details if available and one is selected */}
      {reservas.length > 0 && selectedReserva && reservaDetails && ( //
        <div className="details-container"> {/* */}
          <div className="detail-item"><strong>ID de la Reserva</strong><span>{selectedReserva.id_reserva}</span></div> {/* */}
          <div className="detail-item"><strong>Cliente</strong><span>{reservaDetails.clienteNombre}</span></div> {/* */}
          <div className="detail-item"><strong>Sala Reservada</strong><span>{reservaDetails.salonNombre}</span></div> {/* */}
          <div className="detail-item"><strong>Dirección</strong><span>{reservaDetails.salonDireccion}</span></div> {/* */}
          <div className="detail-item"><strong>Fecha de la Reserva</strong><span>{selectedReserva.fecha_reserva}</span></div> {/* */}
          <div className="detail-item"><strong>Horario</strong><span>{`${selectedReserva.hora_inicio} - ${selectedReserva.hora_fin}`}</span></div> {/* */}
          <div className="detail-item"><strong>Estado</strong><span>{selectedReserva.estado_reserva}</span></div> {/* */}
          {/* Format creation date for better readability */}
          <div className="detail-item"><strong>Fecha del Pedido</strong><span>{new Date(selectedReserva.fecha_creacion).toLocaleString()}</span></div> {/* */}
       </div>
      )}

      {/* Message when no reservations are found */}
      {reservas.length === 0 && ( //
          <p>No se encontraron reservas para el mes seleccionado.</p> //
      )}
    </div>
  );
};

export default PanelReservas;