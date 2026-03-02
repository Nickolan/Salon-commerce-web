import React from 'react';
import './StatCard.css';

const StatCard = ({ data, position, selectedMonth }) => {
  const { total, cambio, colorCambio, icono: Icono, label } = data;
  
  // Formatear total (si es ingresos, formatear como moneda)
  const formattedTotal = label === 'INGRESOS' 
    ? `$${(total / 1000).toFixed(1)}K` 
    : total;

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-icon-wrapper">
          <Icono className="stat-icon" style={{ color: '#2D241E' }} />
        </div>
        <div className="stat-number">{formattedTotal}</div>
        <div className="stat-change">
          <span style={{ color: colorCambio, opacity: 0.8, fontWeight: '600' }}>
            {cambio}
          </span>
          <span className="stat-label">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;