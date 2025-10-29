import React, { useState, useMemo, useEffect } from 'react';
import SearchbarAdmin from '../SearchbarAdmin/SearchbarAdmin';
import BloquearButton from '../BloquearButton/BloquearButton';

// Helper function to format the month string for display
const formatDisplayMonth = (yyyyMm) => { //
   const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; //
    const [year, monthIndex] = yyyyMm.split('-').map(Number); //
    return `${monthNames[monthIndex - 1]} ${year}`; //
};

const PanelSalones = ({ salones, usuarios, selectedMonth }) => { //
  const [selectedSalon, setSelectedSalon] = useState(null); //

  useEffect(() => { //
    // Deselect if the current salon is not in the new list
    if (selectedSalon && !salones.find(s => s.id_salon === selectedSalon.id_salon)) { //
      setSelectedSalon(null); //
    }
  }, [salones, selectedSalon]); //

  const handleSelectSalon = (salon) => { //
   setSelectedSalon(salon); //
  };

  // Find the vendor/publisher details using useMemo for efficiency
  const vendedor = useMemo(() => { //
    if (!selectedSalon || !usuarios) return null; //
    // Find the user whose ID matches the salon's publisher ID
    return usuarios.find(u => u.id_usuario === selectedSalon.id_publicador); //
  }, [selectedSalon, usuarios]); //

  return (
    <div className="admin-panel"> {/* */}
      <h2 className="panel-title">Salones ({formatDisplayMonth(selectedMonth)})</h2> {/* */}
      <SearchbarAdmin //
        items={salones} //
        onSelect={handleSelectSalon} //
        placeholder="Buscar por ID de salón..." //
        displayKey="id_salon" //
      />

      {/* Display salon details if available and one is selected */}
      {salones.length > 0 && selectedSalon && ( //
        <div className="details-container"> {/* */}
          <div className="detail-item"><strong>ID del Salón</strong><span>{selectedSalon.id_salon}</span></div> {/* */}
          {/* Display vendor name if found, otherwise show 'No encontrado' */}
          <div className="detail-item"><strong>Vendedor</strong><span>{vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : 'No encontrado'}</span></div> {/* */}
          <div className="detail-item"><strong>Dirección</strong><span>{selectedSalon.ubicacion}</span></div> {/* */}
          <div className="detail-item"><strong>Capacidad</strong><span>{selectedSalon.capacidad} personas</span></div> {/* */}
          <div className="detail-item"><strong>Valor</strong><span>${selectedSalon.precio_por_hora} por hora</span></div> {/* */}
          {/* Show rating or 'Sin puntaje' */}
          <div className="detail-item"><strong>Puntaje General</strong><span>{selectedSalon.resenia || 'Sin puntaje'}</span></div> {/* */}
          {/* Ensure reservas is an array before getting length */}
          <div className="detail-item"><strong>Cantidad de Reservas</strong><span>{selectedSalon.reservas ? selectedSalon.reservas.length : 0}</span></div> {/* */}
          <BloquearButton type="salón" id={selectedSalon.id_salon} /> {/* */}
        </div>
      )}

      {/* Message when no salons are found */}
      {salones.length === 0 && ( //
        <p>No se encontraron salones para el período seleccionado.</p> //
      )}
    </div>
  );
};

export default PanelSalones;