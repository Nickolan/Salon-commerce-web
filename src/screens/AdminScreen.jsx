import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../Components/PanelAdministrativo/SidebarAdmin/SidebarAdmin';
import HeaderAdmin from '../Components/PanelAdministrativo/HeaderAdmin/HeaderAdmin';
import MainAdmin from '../Components/PanelAdministrativo/MainAdmin/MainAdmin';
import './../styles/AdminScreen.css';

// Importación de los datos JSON
import usuariosData from '../utils/Usuarios.json';
import salonesData from '../utils/Salones.json';
import reservasData from '../utils/Reservas.json';
import transaccionesData from '../utils/Transacciones.json';

const AdminScreen = () => {
  // --- AQUÍ ESTÁ EL CAMBIO ---
  // Se inicializa el estado en 'null' para que no haya un panel activo por defecto.
  const [activePanel, setActivePanel] = useState(null);
  const [adminName, setAdminName] = useState('Administrador');

  useEffect(() => {
    const adminUser = usuariosData.find(u => u.es_administrador);
    if (adminUser) {
      setAdminName(adminUser.nombre);
    }
  }, []);

  const ingresosPropios = transaccionesData
    .filter(t => t.estado_transaccion === 'aprobado')
    .reduce((sum, current) => sum + (current.monto_pagado * 0.10), 0);

  return (
    <div className="admin-screen">
      <div className="sidebar-container">
        <SidebarAdmin activePanel={activePanel} setActivePanel={setActivePanel} />
      </div>
      <div className="main-content-container">
        <HeaderAdmin
          adminName={adminName}
          stats={{
            usuarios: usuariosData.length,
            salones: salonesData.length,
            reservas: reservasData.length,
            ingresos: ingresosPropios,
          }}
          setActivePanel={setActivePanel}
          activePanel={activePanel} // <--- AÑADIR ESTA LÍNEA
        />
        <MainAdmin
          activePanel={activePanel}
          data={{
            usuarios: usuariosData,
            salones: salonesData,
            reservas: reservasData,
            transacciones: transaccionesData,
          }}
        />
      </div>
    </div>
  );
};

export default AdminScreen;