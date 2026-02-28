import React from 'react';
import './StatCard.css';

const StatCard = ({ data, position, selectedMonth }) => {
  const { total, cambio, colorCambio, icono: Icono, label } = data;
  
  // Formatear total (si es ingresos, formatear como moneda)
  const formattedTotal = label === 'INGRESOS' 
    ? `$${(total / 1000).toFixed(1)}K` 
    : total;

  // Determinar si el cambio es positivo, negativo o cero
  const cambioNumero = parseFloat(cambio);
  const signo = cambioNumero > 0 ? '+' : cambioNumero < 0 ? '-' : '';
  const color = cambioNumero > 0 ? '#085D14' : cambioNumero < 0 ? '#AD1519' : '#F1B300';

  return (
    <div className="stat-card" style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <div className="stat-card-content">
        <div className="stat-icon-wrapper">
          <Icono className="stat-icon" style={{ color: '#2D241E' }} />
        </div>
        <div className="stat-number">{formattedTotal}</div>
        <div className="stat-change">
          <span style={{ color: colorCambio || color, opacity: 0.6 }}>
            {cambio}
          </span>
          <span className="stat-label">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;