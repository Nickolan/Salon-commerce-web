import React, { useState, useMemo } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import BloquearButton from '../BloquearButton/BloquearButton';

// VERIFICACIÓN 1: El nombre de la función debe ser "PanelSalones"
const PanelSalones = ({ salones, usuarios }) => {
  const [selectedSalon, setSelectedSalon] = useState(null);

  const handleSelectSalon = (salon) => {
    setSelectedSalon(salon);
  };
  
  const vendedor = useMemo(() => {
    if (!selectedSalon || !usuarios) return null;
    return usuarios.find(u => u.id_usuario === selectedSalon.id_publicador);
  }, [selectedSalon, usuarios]);

  return (
    <div className="admin-panel">
      {/* VERIFICACIÓN 2: El título debe ser "Salones" */}
      <h2 className="panel-title">Salones</h2>
      
      <SearchbarAdmin
        items={salones}
        onSelect={handleSelectSalon}
        placeholder="Buscar por ID de salón..."
        displayKey="id_salon"
      />

      {selectedSalon && (
        <div className="details-container">
          <div className="detail-item">
            <strong>ID del Salón</strong>
            <span>{selectedSalon.id_salon}</span>
          </div>
          <div className="detail-item">
            <strong>Vendedor</strong>
            <span>{vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'Vendedor no encontrado'}</span>
          </div>
          <div className="detail-item">
            <strong>Dirección</strong>
            <span>{selectedSalon.ubicacion}</span>
          </div>
          <div className="detail-item">
            <strong>Capacidad</strong>
            <span>{selectedSalon.capacidad} personas</span>
          </div>
          <div className="detail-item">
            <strong>Valor</strong>
            <span>${selectedSalon.precio_por_hora} por hora</span>
          </div>
          <div className="detail-item">
            <strong>Puntaje General</strong>
            <span>{selectedSalon.resenia || 'Sin puntaje'}</span>
          </div>
          <div className="detail-item">
            <strong>Cantidad de Reservas</strong>
            <span>{selectedSalon.reservas ? selectedSalon.reservas.length : 0}</span>
          </div>
          <BloquearButton type="salón" id={selectedSalon.id_salon} />
        </div>
      )}
    </div>
  );
};

// VERIFICACIÓN 3: La exportación debe ser de "PanelSalones"
export default PanelSalones;
