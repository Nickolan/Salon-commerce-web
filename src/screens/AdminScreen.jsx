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

// --- ELIMINAR IMPORTS DE JSON ---
// import usuariosData from '../utils/Usuarios.json';
// import salonesData from '../utils/Salones.json';
// import reservasData from '../utils/Reservas.json';
// import transaccionesData from '../utils/Transacciones.json';

const getDefaultMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

const AdminScreen = () => {
  const dispatch = useDispatch(); // <-- Hook
  const [activePanel, setActivePanel] = useState(null); // Panel a mostrar (Usuarios, Salones, etc.)
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
    // Obtener nombre del admin desde el usuario logueado
    if (user && user.es_administrador) {
      setAdminName(user.nombre || 'Admin');
    }
    // Si no es admin, podrías redirigir aquí
    // else { navigate('/'); }
  }, [user]);

  // --- EFECTO PARA DISPARAR THUNKS AL CAMBIAR EL MES ---
  useEffect(() => {
    if (selectedMonth) {
      dispatch(fetchAdminUsersByMonth(selectedMonth));
      dispatch(fetchAdminSalonsByMonth(selectedMonth));
      dispatch(fetchAdminReservasByMonth(selectedMonth));
      dispatch(fetchAdminTransaccionesByMonth(selectedMonth));
    }
  }, [selectedMonth, dispatch]); // Se ejecuta cuando selectedMonth o dispatch cambian
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
    <div className="admin-screen"> {/* Contenedor principal de la pantalla */}
      <div className="sidebar-container"> {/* Contenedor para la barra lateral */}
        <SidebarAdmin activePanel={activePanel} setActivePanel={setActivePanel} /> {/* Componente de barra lateral */}
      </div>
      <div className="main-content-container"> {/* Contenedor para el contenido principal */}
        <HeaderAdmin
          adminName={adminName} // Nombre del administrador
          stats={stats} // Estadísticas calculadas
          setActivePanel={setActivePanel} // Función para cambiar el panel activo
          activePanel={activePanel} // Panel activo actual
          selectedMonth={selectedMonth} // Mes seleccionado
          setSelectedMonth={setSelectedMonth} // Función para cambiar el mes
        />
        {/* Opcional: Mostrar un loader global si algo está cargando */}
        {isLoadingData && <div className="admin-loading-indicator">Cargando datos...</div>}

        {/* --- PASAR DATOS DE REDUX AL MAINADMIN --- */}
        {!isLoadingData && ( // Renderizar MainAdmin solo si no hay carga global
          <MainAdmin
            activePanel={activePanel} // Panel activo
            // Pasamos los datos específicos del mes desde Redux
            data={{
              usuarios: adminUsers,
              salones: adminSalones,
              reservas: adminReservas,
              transacciones: adminTransacciones,
            }}
            // Pasamos las listas completas (cargadas para el mes) por si se necesitan
            // para buscar relaciones entre diferentes tipos de datos dentro de los paneles.
            fullData={{
                 usuarios: adminUsers,
                 salones: adminSalones,
                 reservas: adminReservas,
                 // No necesitamos pasar transacciones aquí usualmente
            }}
            selectedMonth={selectedMonth} // Pasar el mes seleccionado
          />
        )}
        {/* --- FIN PASO DE DATOS --- */}
      </div>
    </div>
  );
};

export default AdminScreen;