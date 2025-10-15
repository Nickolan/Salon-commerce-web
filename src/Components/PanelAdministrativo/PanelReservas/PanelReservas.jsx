import React, { useState, useMemo } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';

const PanelReservas = ({ reservas, salones, usuarios }) => {
  const [selectedReserva, setSelectedReserva] = useState(null);

  const handleSelectReserva = (reserva) => {
    setSelectedReserva(reserva);
  };
  
  // Usamos useMemo para optimizar y no recalcular en cada render
  const reservaDetails = useMemo(() => {
    if (!selectedReserva) return null;

    const cliente = usuarios.find(u => u.id_usuario === selectedReserva.id_arrendatario);
    const salon = salones.find(s => s.id_salon === selectedReserva.id_salon);

    return {
      cliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'No encontrado',
      salon: salon ? salon.nombre : 'No encontrado',
      direccion: salon ? salon.ubicacion : 'No encontrada',
    };
  }, [selectedReserva, usuarios, salones]);

  return (
    <div className="admin-panel">
      <h2 className="panel-title">Reservas</h2>
      <SearchbarAdmin
        items={reservas}
        onSelect={handleSelectReserva}
        placeholder="Buscar por ID de reserva..."
        displayKey="id_reserva"
      />

      {selectedReserva && reservaDetails && (
        <div className="details-container">
          <div className="detail-item">
            <strong>ID de la Reserva</strong>
            <span>{selectedReserva.id_reserva}</span>
          </div>
          <div className="detail-item">
            <strong>Cliente</strong>
            <span>{reservaDetails.cliente}</span>
          </div>
          <div className="detail-item">
            <strong>Sala Reservada</strong>
            <span>{reservaDetails.salon}</span>
          </div>
          <div className="detail-item">
            <strong>Dirección</strong>
            <span>{reservaDetails.direccion}</span>
          </div>
          <div className="detail-item">
            <strong>Fecha de la Reserva</strong>
            <span>{selectedReserva.fecha_reserva}</span>
          </div>
            <div className="detail-item">
            <strong>Horario de la Reserva</strong>
            <span>{selectedReserva.hora_inicio} - {selectedReserva.hora_fin}</span>
          </div>
          <div className="detail-item">
            <strong>Estado</strong>
            <span>{selectedReserva.estado_reserva}</span>
          </div>
          <div className="detail-item">
            <strong>Fecha del Pedido de Reserva</strong>
            <span>{new Date(selectedReserva.fecha_creacion).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelReservas;