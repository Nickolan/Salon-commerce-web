import React, { useState, useEffect, useMemo } from 'react';
import SidebarAdmin from '../Components/PanelAdministrativo/SidebarAdmin/SidebarAdmin';
import HeaderAdmin from '../Components/PanelAdministrativo/HeaderAdmin/HeaderAdmin';
import MainAdmin from '../Components/PanelAdministrativo/MainAdmin/MainAdmin';
import './../styles/AdminScreen.css';

import usuariosData from '../utils/Usuarios.json';
import salonesData from '../utils/Salones.json';
import reservasData from '../utils/Reservas.json';
import transaccionesData from '../utils/Transacciones.json';

const getDefaultMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

const AdminScreen = () => {
  const [activePanel, setActivePanel] = useState(null);
  const [adminName, setAdminName] = useState('Administrador');
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());

  useEffect(() => {
    const adminUser = usuariosData.find(u => u.es_administrador);
    if (adminUser) {
      setAdminName(adminUser.nombre);
    }
  }, []);

  // --- NUEVA LÓGICA DE FILTRADO CENTRALIZADA ---
  const filteredData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    // Creamos una fecha para el final del mes seleccionado para las comparaciones
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Usuarios: Todos los registrados ANTES o DURANTE el mes seleccionado
    const usuariosFiltrados = usuariosData.filter(user => new Date(user.fecha_creacion) <= endOfMonth);

    // Salones: Todos los publicados ANTES o DURANTE el mes seleccionado
    const salonesFiltrados = salonesData.filter(salon => new Date(salon.fecha_creacion) <= endOfMonth);

    // Reservas: Solo las que tienen fecha DENTRO del mes seleccionado
    const reservasFiltradas = reservasData.filter(reserva => reserva.fecha_reserva.startsWith(selectedMonth));

    // Transacciones: Solo las que ocurrieron DENTRO del mes seleccionado
    const transaccionesFiltradas = transaccionesData.filter(t => t.fecha_transaccion.startsWith(selectedMonth));

    // Ingresos: Se calculan sobre las transacciones aprobadas del mes
    const ingresosDelMes = transaccionesFiltradas
      .filter(t => t.estado_transaccion === 'aprobado')
      .reduce((sum, current) => sum + (current.monto_pagado * 0.10), 0);
      
    return {
      usuarios: usuariosFiltrados,
      salones: salonesFiltrados,
      reservas: reservasFiltradas,
      transacciones: transaccionesFiltradas,
      ingresos: ingresosDelMes
    };
  }, [selectedMonth]);

  return (
    <div className="admin-screen">
      <div className="sidebar-container">
        <SidebarAdmin activePanel={activePanel} setActivePanel={setActivePanel} />
      </div>
      <div className="main-content-container">
        <HeaderAdmin
          adminName={adminName}
          stats={{
            // Los contadores ahora vienen de las listas ya filtradas
            usuarios: filteredData.usuarios.length,
            salones: filteredData.salones.length,
            reservas: filteredData.reservas.length,
            ingresos: filteredData.ingresos,
          }}
          setActivePanel={setActivePanel}
          activePanel={activePanel}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        <MainAdmin
          activePanel={activePanel}
          // Pasamos las listas filtradas para mostrar...
          data={filteredData}
          // ... y las listas completas para hacer búsquedas internas (ej. buscar el vendedor de un salón)
          fullData={{
            usuarios: usuariosData,
            salones: salonesData,
            reservas: reservasData,
          }}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  );
};

export default AdminScreen;