// src/screens/AdminScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // <-- Hooks
import SidebarAdmin from '../Components/PanelAdministrativo/SidebarAdmin/SidebarAdmin';
import HeaderAdmin from '../Components/PanelAdministrativo/HeaderAdmin/HeaderAdmin';
import MainAdmin from '../Components/PanelAdministrativo/MainAdmin/MainAdmin';
import './../styles/AdminScreen.css';

// --- Importar los nuevos thunks ---
import { fetchAdminUsersByMonth } from '../store/features/auth/authSlice';
import { fetchAdminSalonsByMonth } from '../store/features/salones/salonSlice';
// Asumiendo que creaste estos en reservasSlice:
import { fetchAdminReservasByMonth, fetchAdminTransaccionesByMonth } from '../store/features/reservas/reservasSlice';

const getDefaultMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

const AdminScreen = () => {
  const dispatch = useDispatch(); // <-- Hook
  const [activePanel, setActivePanel] = useState('PanelAdministrador'); // Default al panel admin
  const [adminName, setAdminName] = useState('Administrador');
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth()); 

  // --- LEER DATOS Y ESTADOS DE REDUX ---
  const { user } = useSelector((state) => state.auth); // Para el nombre
  const { adminUsers, adminUsersStatus } = useSelector((state) => state.auth);
  const { adminSalones, adminSalonesStatus } = useSelector((state) => state.salones);
  // Asumiendo estos estados en reservasSlice:
  const { adminReservas, adminReservasStatus, adminTransacciones, adminTransaccionesStatus } = useSelector((state) => state.reservas);
  // --- FIN LECTURA REDUX ---

  useEffect(() => {
    if (selectedMonth) {
      console.log('🔴 CALENDARIO - Mes seleccionado:', selectedMonth);
      console.log('🔴 Disparando thunks para el mes:', selectedMonth);
      
      console.log('▶️ Llamando a fetchAdminReservasByMonth con:', selectedMonth);
      dispatch(fetchAdminReservasByMonth(selectedMonth));
      
      console.log('▶️ Llamando a fetchAdminUsersByMonth con:', selectedMonth);
      dispatch(fetchAdminUsersByMonth(selectedMonth));
      
      console.log('▶️ Llamando a fetchAdminSalonsByMonth con:', selectedMonth);
      dispatch(fetchAdminSalonsByMonth(selectedMonth));
      
      console.log('▶️ Llamando a fetchAdminTransaccionesByMonth con:', selectedMonth);
      dispatch(fetchAdminTransaccionesByMonth(selectedMonth));
    }
  }, [selectedMonth, dispatch]);

  // También añade logs para ver qué llega de Redux:
  useEffect(() => {
    console.log('📊 DATOS RECIBIDOS DE REDUX:');
    console.log('adminUsers:', adminUsers?.length || 0, 'usuarios');
    console.log('adminReservas:', adminReservas?.length || 0, 'reservas');
    console.log('adminTransacciones:', adminTransacciones?.length || 0, 'transacciones');
    console.log('adminSalones:', adminSalones?.length || 0, 'salones');

    console.log('📊 VERIFICACIÓN DE TRANSACCIONES POR MES:');
    console.log('Mes seleccionado:', selectedMonth);
    console.log('Transacciones recibidas:', adminTransacciones?.length || 0);
    console.log('Detalle de transacciones:', adminTransacciones?.map(t => ({
      id: t.id_transaccion,
      fecha: t.fecha_transaccion,
      monto: t.monto_pagado,
      estado: t.estado_transaccion,
      reservaId: t.reservaIdReserva || t.id_reserva
  })));

  }, [adminUsers, adminReservas, selectedMonth, adminTransacciones, adminSalones,]); // Se ejecuta cuando selectedMonth o dispatch cambian
  // --- FIN EFECTO ---

  // --- CALCULAR ESTADÍSTICAS ---
  // Ahora calculamos ingresos sobre las transacciones YA FILTRADAS por la API
  const ingresosDelMes = useMemo(() => {
     if (adminTransaccionesStatus !== 'succeeded') return 0; // Solo calcular si la carga fue exitosa
     return adminTransacciones
       .filter(t => t.estado_transaccion === 'aprobado') // Filtrar transacciones aprobadas
       .reduce((sum, current) => sum + (current.monto_pagado * 0.10), 0); // Sumar el 10% de cada una [cite: 1699-1700]
  }, [adminTransacciones, adminTransaccionesStatus]); // Recalcular si cambian las transacciones o su estado de carga

  // Calcula las estadísticas generales usando los datos cargados
  const stats = useMemo(() => ({
    usuarios: adminUsersStatus === 'succeeded' ? adminUsers.length : 0, // Contar usuarios si la carga fue exitosa
    salones: adminSalonesStatus === 'succeeded' ? adminSalones.length : 0, // Contar salones si la carga fue exitosa
    reservas: adminReservasStatus === 'succeeded' ? adminReservas.length : 0, // Contar reservas si la carga fue exitosa
    ingresos: ingresosDelMes, // Usar el valor calculado
  }), [adminUsers, adminSalones, adminReservas, ingresosDelMes, adminUsersStatus, adminSalonesStatus, adminReservasStatus]); // Recalcular si cambian los datos o sus estados
  // --- FIN CÁLCULO STATS ---

  // Determinar si algún dato está cargando para mostrar indicador global (opcional)
  const isLoadingData = adminUsersStatus === 'loading' || adminSalonesStatus === 'loading' || adminReservasStatus === 'loading' || adminTransaccionesStatus === 'loading';

  return (
    <div className="admin-screen">
      <div className="sidebar-container">
        <SidebarAdmin activePanel={activePanel} setActivePanel={setActivePanel} />
      </div>
      
      <div className="main-content-container">
        {/* HeaderAdmin - SOLO se muestra si NO es PanelAdministrador */}
        {activePanel !== 'PanelAdministrador' && (
          <HeaderAdmin
            adminName={user?.nombre || 'Administrador'}
            stats={stats}
            setActivePanel={setActivePanel}
            activePanel={activePanel}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}
        
        {/* Contenido principal - siempre visible */}
          {isLoadingData ? (
            <div className="admin-loading-indicator">Cargando datos...</div>
          ) : (
            <MainAdmin
              activePanel={activePanel}
              selectedMonth={selectedMonth}
              data={{
                usuarios: adminUsers,
                salones: adminSalones,
                reservas: adminReservas,
                transacciones: adminTransacciones,
              }}
              fullData={{
                usuarios: adminUsers,
                salones: adminSalones,
                reservas: adminReservas,
              }}
              onMonthChange={setSelectedMonth}
            />
          )}
        </div>
      </div>
  );
};

export default AdminScreen;