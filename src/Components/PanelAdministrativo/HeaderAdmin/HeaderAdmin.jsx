import React from 'react';
import './HeaderAdmin.css';

const HeaderAdmin = ({ adminName, stats, setActivePanel }) => {
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
        <button onClick={() => setActivePanel('Usuarios')}>
          {stats.usuarios} Usuarios
        </button>
        <button onClick={() => setActivePanel('Salones')}>
          {stats.salones} Salones
        </button>
        <button onClick={() => setActivePanel('Reservas')}>
          {stats.reservas} Reservas
        </button>
        <button onClick={() => setActivePanel('Ingresos')}>
          {formatCurrency(stats.ingresos)} Ingresos
        </button>
      </div>
    </div>
  );
};

export default HeaderAdmin;