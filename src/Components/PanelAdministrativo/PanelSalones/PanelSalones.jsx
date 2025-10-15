import React, { useState, useMemo } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import BloquearButton from '../BloquearButton/BloquearButton';

const PanelSalones = ({ salones, usuarios }) => {
  const [selectedSalon, setSelectedSalon] = useState(null);

  const handleSelectSalon = (salon) => {
    setSelectedSalon(salon);
  };
  
  // Usamos useMemo para no recalcular el vendedor en cada render, solo si cambia el salón seleccionado.
  const vendedor = useMemo(() => {
    if (!selectedSalon) return null;
    return usuarios.find(u => u.id_usuario === selectedSalon.id_publicador);
  }, [selectedSalon, usuarios]);


  return (
    <div className="admin-panel">
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
            <span>{vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'No encontrado'}</span>
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

export default PanelSalones;
