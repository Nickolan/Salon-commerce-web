import React, { useState, useEffect } from 'react';
import SearchbarSalones from './ComponenteSalonesAdmin/SearchbarSalones';
import ItemSalonAdmin from './ComponenteSalonesAdmin/ItemSalonAdmin';
import './PanelSalones.css';

const PanelSalones = ({ 
  salones, 
  onEliminarSalon 
}) => {
  const [filterValue, setFilterValue] = useState('');
  const [expandedSalonId, setExpandedSalonId] = useState(null);
  const [filteredSalones, setFilteredSalones] = useState(salones || []);

  // Filtrar salones por nombre
  useEffect(() => {
    if (!salones) return;
    
    if (!filterValue.trim()) {
      setFilteredSalones(salones);
    } else {
      const filtered = salones.filter(salon =>
        salon.nombre?.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredSalones(filtered);
    }
  }, [salones, filterValue]);

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleApplyFilter = () => {
    // Filtrado ya aplicado en tiempo real
  };

  const handleToggleExpand = (salonId) => {
    setExpandedSalonId(expandedSalonId === salonId ? null : salonId);
  };

  return (
    <div className="panel-salones">
      <SearchbarSalones
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
        onApplyFilter={handleApplyFilter}
        totalResultados={filteredSalones?.length || 0}
      />

      <div className="salones-list">
        {filteredSalones?.length > 0 ? (
          filteredSalones.map(salon => (
            <ItemSalonAdmin
              key={salon.id_salon}
              salon={salon}
              isExpanded={expandedSalonId === salon.id_salon}
              onToggleExpand={() => handleToggleExpand(salon.id_salon)}
              onEliminar={onEliminarSalon}
            />
          ))
        ) : (
          <div className="no-resultados">
            <p>No se encontraron salones</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelSalones;