import React from 'react';
import './HeaderAdmin.css';

const HeaderAdmin = ({ activePanel, selectedMonth, onMonthChange }) => {
  const getHeaderTitle = () => {
    switch(activePanel) {
      case 'Reservas':
        return 'GESTIÓN DE RESERVAS';
      case 'Usuarios':
        return 'GESTIÓN DE USUARIOS';
      case 'Salones':
        return 'GESTIÓN DE SALONES';
      case 'Ingresos':
        return 'GESTIÓN DE INGRESOS';
      default:
        return 'PANEL DE ADMINISTRACIÓN';
    }
  };

  return (
    <div className="header-admin">
      <h1 className="header-welcome">{getHeaderTitle()}</h1>
      
      <div className="header-controls">
        <div className="month-selector-wrapper">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="month-selector-input"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;