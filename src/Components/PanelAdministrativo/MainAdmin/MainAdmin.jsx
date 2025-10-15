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
        // Pasamos todos los datos porque el panel de reservas necesita cruzar información
        return <PanelReservas reservas={data.reservas} salones={data.salones} usuarios={data.usuarios} />;
      case 'Ingresos':
         // El panel de ingresos es el que más datos cruzados necesita
        return <PanelIngresos transacciones={data.transacciones} reservas={data.reservas} salones={data.salones} usuarios={data.usuarios} />;
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;