import React from 'react';
import PanelUsuarios from '../PanelUsuarios/PanelUsuarios';
import PanelSalones from '../PanelSalones/PanelSalones';
import PanelReservas from '../PanelReservas/PanelReservas';
import PanelIngresos from '../PanelIngresos/PanelIngresos';
import './MainAdmin.css';

const MainAdmin = ({ activePanel, data }) => {
  const renderPanel = () => {
    switch (activePanel) {
      case 'Usuarios':
        return <PanelUsuarios usuarios={data.usuarios} />;
      case 'Salones':
        return <PanelSalones salones={data.salones} usuarios={data.usuarios} />;
      case 'Reservas':
        return <PanelReservas reservas={data.reservas} salones={data.salones} usuarios={data.usuarios} />;
      case 'Ingresos':
        return <PanelIngresos transacciones={data.transacciones} reservas={data.reservas} salones={data.salones} usuarios={data.usuarios} />;
      
      // --- AQUÍ ESTÁ EL CAMBIO ---
      // Si 'activePanel' es 'null' o cualquier otro valor, no se retorna nada.
      default:
        return null;
    }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;