import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

const formatDisplayMonth = (yyyyMm) => {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const [year, monthIndex] = yyyyMm.split('-').map(Number);
    return `${monthNames[monthIndex - 1]} ${year}`;
};

const PanelReservas = ({ reservas, salones, usuarios, selectedMonth }) => {
  const [selectedReserva, setSelectedReserva] = useState(null);

  useEffect(() => {
      if (selectedReserva && !reservas.find(r => r.id_reserva === selectedReserva.id_reserva)) {
          setSelectedReserva(null);
      }
  }, [reservas, selectedReserva]);

  const handleSelectReserva = (reserva) => {
    setSelectedReserva(reserva);
  };
  
  const reservaDetails = useMemo(() => {
    if (!selectedReserva) return null;
    const cliente = usuarios.find(u => u.id_usuario === selectedReserva.id_arrendatario);
    const salon = salones.find(s => s.id_salon === selectedReserva.id_salon);
    return {
      clienteNombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado',
      salonNombre: salon ? salon.nombre : 'No encontrado',
      salonDireccion: salon ? salon.ubicacion : 'No encontrada',
    };
  }, [selectedReserva, usuarios, salones]);

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