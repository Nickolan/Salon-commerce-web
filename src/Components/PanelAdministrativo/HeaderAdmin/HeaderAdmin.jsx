import React from 'react';
import './HeaderAdmin.css';

// 1. Recibimos el prop 'activePanel'
const HeaderAdmin = ({ adminName, stats, setActivePanel, activePanel }) => {
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
      <div className="header-stats-buttons">
        {/* 2. Añadimos la clase 'active' dinámicamente */}
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
  );
};

export default HeaderAdmin;