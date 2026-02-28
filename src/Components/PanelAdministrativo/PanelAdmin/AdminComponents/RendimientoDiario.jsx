// PanelAdmin/AdminComponents/RendimientoDiario.jsx
import React from 'react';
import './RendimientoDiario.css';

const RendimientoDiario = ({ selectedMonth, onMonthChange, data }) => {
  
  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    console.log('📅 Calendario RendimientoDiario - Mes seleccionado:', newMonth);
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
  };

  return (
    <div className="rendimiento-diario">
      <div className="rendimiento-header">
        <h2 className="rendimiento-titulo">Rendimiento Diario</h2>
        <div className="month-selector-wrapper">
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-selector-input"
            // 👇 ELIMINAMOS EL MAX para permitir cualquier fecha
            // max={new Date().toISOString().slice(0, 7)}
          />
        </div>
      </div>
      <div className="rendimiento-contenido">
        <p className="placeholder-text">Gráfico de rendimiento para {selectedMonth}</p>
        <p className="placeholder-subtext">
          {data?.reservas?.length || 0} reservas en el mes
        </p>
      </div>
    </div>
  );
};

export default RendimientoDiario;