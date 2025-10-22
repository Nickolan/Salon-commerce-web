import React from 'react';
import './HeaderAdmin.css';

const HeaderAdmin = ({ adminName, stats, setActivePanel, activePanel, selectedMonth, setSelectedMonth }) => {
  const formatCurrency = (number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="header-admin">
      <h2 className="header-welcome">¡Hola {adminName}!</h2>
      
      <div className="header-controls">
        
        {/* El <label> ha sido eliminado de aquí. El input queda solo. */}
        <div className="month-selector-wrapper">
          <input
            type="month"
            id="month-select"
            className="month-selector-input"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="header-stats-buttons">
          <button 
            onClick={() => setActivePanel('Usuarios')}
            className={activePanel === 'Usuarios' ? 'active' : ''}
          >
            {stats.usuarios} Usuarios
          </button>
          <button 
            onClick={() => setActivePanel('Salones')}
            className={activePanel === 'Salones' ? 'active' : ''}
          >
            {stats.salones} Salones
          </button>
          <button 
            onClick={() => setActivePanel('Reservas')}
            className={activePanel === 'Reservas' ? 'active' : ''}
          >
            {stats.reservas} Reservas
          </button>
          <button 
            onClick={() => setActivePanel('Ingresos')}
            className={activePanel === 'Ingresos' ? 'active' : ''}
          >
            {formatCurrency(stats.ingresos)} Ingresos
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
