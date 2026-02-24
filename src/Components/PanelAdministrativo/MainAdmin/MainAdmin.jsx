import React, { useState, useMemo } from 'react';
import PanelUsuarios from '../PanelUsuarios/PanelUsuarios';
import PanelSalones from '../PanelSalones/PanelSalones';
import PanelReservas from '../PanelReservas/PanelReservas';
import PanelIngresos from '../PanelIngresos/PanelIngresos';
import TransaccionService from '../../../store/features/transaccion/transaccionService';
import './MainAdmin.css';

const MainAdmin = ({ activePanel, data, fullData, selectedMonth }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const handleReservaActualizada = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const reservasConTransacciones = useMemo(() => {
    return TransaccionService.combinarReservasConTransacciones(data?.reservas || [], data?.transacciones || []);
  }, [data?.reservas, data?.transacciones]);

  const renderPanel = () => {

    switch (activePanel) {
      case 'Usuarios':
        return <PanelUsuarios 
                  usuarios={data?.usuarios || []} 
                  selectedMonth={selectedMonth}
                  onUserDeleted={(userId) => {
                    const updatedUsers = data.usuarios.filter(u => u.id_usuario !== userId);
                  }}
                />;
      case 'Salones':
        return <PanelSalones
                  salones={data?.salones || []}
                  usuarios={fullData?.usuarios || []}
                  selectedMonth={selectedMonth}
                />;
      case 'Reservas':
        return <PanelReservas 
                  reservas={reservasConTransacciones} 
                  salones={data?.salones || []} 
                  usuarios={data?.usuarios || []} 
                  selectedMonth={selectedMonth}
                  onReservaActualizada={handleReservaActualizada} 
                />;
      case 'Ingresos':
        return <PanelIngresos
                  transacciones={data?.transacciones || []}
                  reservas={fullData?.reservas || []}
                  salones={fullData?.salones || []}
                  usuarios={fullData?.usuarios || []}
                  selectedMonth={selectedMonth}
                />;
      default:
        console.log('❌ Panel no reconocido:', activePanel);
        return null;
    }
  };

  return <main className="main-admin-content">{renderPanel()}</main>;
};

export default MainAdmin;