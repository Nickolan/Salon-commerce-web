import React from 'react';
import PanelUsuarios from '../PanelUsuarios/PanelUsuarios';
import PanelSalones from '../PanelSalones/PanelSalones';
import PanelReservas from '../PanelReservas/PanelReservas';
import PanelIngresos from '../PanelIngresos/PanelIngresos';
import './MainAdmin.css';

const MainAdmin = ({ activePanel, data, fullData, selectedMonth }) => {
  const renderPanel = () => {
    switch (activePanel) {
      case 'Usuarios':
        return <PanelUsuarios 
                  usuarios={data.usuarios} 
                  selectedMonth={selectedMonth} 
                />;
      case 'Salones':
        return <PanelSalones 
                  salones={data.salones} 
                  usuarios={fullData.usuarios} 
                  selectedMonth={selectedMonth} 
                />;
      case 'Reservas':
        return <PanelReservas 
                  reservas={data.reservas} 
                  salones={fullData.salones} 
                  usuarios={fullData.usuarios} 
                  selectedMonth={selectedMonth} 
                />;
      case 'Ingresos':
        return <PanelIngresos 
                  transacciones={data.transacciones} 
                  reservas={fullData.reservas} 
                  salones={fullData.salones} 
                  usuarios={fullData.usuarios} 
                  selectedMonth={selectedMonth} 
                />;
      default:
        return null;
    }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;