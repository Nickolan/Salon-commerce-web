import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

// Helper function to format the month string
const formatDisplayMonth = (yyyyMm) => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const [year, monthIndex] = yyyyMm.split('-').map(Number);
    return `${monthNames[monthIndex - 1]} ${year}`;
};

const PanelReservas = ({ reservas, salones, usuarios, selectedMonth }) => {
  // El console.log que tenías aquí está bien para depurar
  console.log(usuarios);
  
  const [selectedReserva, setSelectedReserva] = useState(null);

  useEffect(() => {
     if (selectedReserva && !reservas.find(r => r.id_reserva === selectedReserva.id_reserva)) {
          setSelectedReserva(null);
      }
  }, [reservas, selectedReserva]);

  const handleSelectReserva = (reserva) => {
    setSelectedReserva(reserva);
  };

  // --- CAMBIOS CLAVE AQUÍ ---
  const reservaDetails = useMemo(() => {
    if (!selectedReserva) return null;

    // 1. Leemos los objetos anidados directamente desde la reserva seleccionada
    const cliente = selectedReserva.arrendatario;
    const salon = selectedReserva.salon;

    return {
      // 2. Formateamos los nombres del cliente
      clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado',
      // 3. Obtenemos el nombre del salón
      salonNombre: salon ? salon.nombre : 'No encontrado',
      // 4. Corregimos el nombre de la propiedad de 'ubicacion' a 'direccion'
      salonDireccion: salon ? salon.direccion : 'No encontrada',
    };
    // 5. Los props 'usuarios' y 'salones' ya no son necesarios para este cálculo
  }, [selectedReserva]); // La única dependencia ahora es la reserva seleccionada

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Reservas ({formatDisplayMonth(selectedMonth)})</h2>
      <SearchbarAdmin
        items={reservas}
        onSelect={handleSelectReserva}
        placeholder="Buscar por ID de reserva..."
        displayKey="id_reserva"
      />

      {reservas.length > 0 && selectedReserva && reservaDetails && (
        <div className="details-container">
          <div className="detail-item"><strong>ID de la Reserva</strong><span>{selectedReserva.id_reserva}</span></div>
          <div className="detail-item"><strong>Cliente</strong><span>{reservaDetails.clienteNombre}</span></div>
          <div className="detail-item"><strong>Sala Reservada</strong><span>{reservaDetails.salonNombre}</span></div>
          <div className="detail-item"><strong>Dirección</strong><span>{reservaDetails.salonDireccion}</span></div>
          <div className="detail-item"><strong>Fecha de la Reserva</strong><span>{selectedReserva.fecha_reserva}</span></div>
          <div className="detail-item"><strong>Horario</strong><span>{`${selectedReserva.hora_inicio} - ${selectedReserva.hora_fin}`}</span></div>
          <div className="detail-item"><strong>Estado</strong><span>{selectedReserva.estado_reserva}</span></div>
          <div className="detail-item"><strong>Fecha del Pedido</strong><span>{new Date(selectedReserva.fecha_creacion).toLocaleString()}</span></div>
       </div>
      )}

      {reservas.length === 0 && (
          <p>No se encontraron reservas para el mes seleccionado.</p>
      )}
    </div>
  );
};

export default PanelReservas;