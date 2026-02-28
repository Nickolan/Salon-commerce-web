import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useAdminStats = (selectedMonth) => {
  // ✅ Todos los hooks AL INICIO, sin condiciones
  const [stats, setStats] = useState({
    reservas: { total: 0, cambio: '+0%', colorCambio: '#085D14', label: 'Reservas' },
    usuarios: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'USUARIOS' },
    salones: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'SALONES' },
    ingresos: { total: 0, cambio: '+0%', colorCambio: '#085D14', label: 'INGRESOS' }
  });
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  // ✅ Todos los useSelector juntos al inicio
  const { adminUsers, adminUsersStatus } = useSelector((state) => state.auth);
  const { adminSalones, adminSalonesStatus } = useSelector((state) => state.salones);
  const { adminReservas, adminReservasStatus, adminTransacciones, adminTransaccionesStatus } = useSelector((state) => state.reservas);

  // Funciones auxiliares (no son Hooks, pueden ir después)
  const calcularCambio = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? '+100%' : '0%';
    const cambio = ((actual - anterior) / anterior) * 100;
    const signo = cambio > 0 ? '+' : '';
    return `${signo}${cambio.toFixed(0)}%`;
  };

  const getColorPorCambio = (cambio) => {
    if (cambio.includes('+')) return '#085D14';
    if (cambio === '0%') return '#F1B300';
    return '#AD1519';
  };

  // ✅ useEffect siempre se llama, la condición va DENTRO
  useEffect(() => {
    // La validación de selectedMonth va DENTRO del efecto
    if (!selectedMonth) return;

    const calcularEstadisticas = async () => {
      setLoading(true);

      // Verificar datos cargados
      const allStatusLoaded = 
        adminReservasStatus === 'succeeded' && 
        adminUsersStatus === 'succeeded' && 
        adminSalonesStatus === 'succeeded' && 
        adminTransaccionesStatus === 'succeeded';

      if (!allStatusLoaded) {
        setLoading(false);
        return;
      }

      // Calcular estadísticas
      const reservasActual = adminReservas?.length || 0;
      const usuariosActual = adminUsers?.length || 0;
      const salonesActual = adminSalones?.length || 0;
      
      // Calcular ingresos con todas las transacciones
      const ingresosActual = (adminTransacciones || []).reduce((sum, t) => {
        const monto = Number(t.monto_pagado) || 0;
        return sum + monto;
      }, 0);

      // Debug info
      setDebugInfo({
        mes: selectedMonth,
        totalTransacciones: adminTransacciones?.length || 0,
        ingresosCalculados: ingresosActual,
        transacciones: adminTransacciones?.map(t => ({
          id: t.id_transaccion,
          monto: t.monto_pagado
        }))
      });

      // Calcular cambios (placeholder por ahora)
      const cambioReservas = reservasActual > 0 ? '+100%' : '0%';
      const cambioUsuarios = usuariosActual > 0 ? '+100%' : '0%';
      const cambioSalones = salonesActual > 0 ? '+100%' : '0%';
      const cambioIngresos = ingresosActual > 0 ? '+100%' : '0%';

      setStats({
        reservas: {
          total: reservasActual,
          cambio: cambioReservas,
          colorCambio: getColorPorCambio(cambioReservas),
          label: 'Reservas'
        },
        usuarios: {
          total: usuariosActual,
          cambio: cambioUsuarios,
          colorCambio: getColorPorCambio(cambioUsuarios),
          label: 'USUARIOS'
        },
        salones: {
          total: salonesActual,
          cambio: cambioSalones,
          colorCambio: getColorPorCambio(cambioSalones),
          label: 'SALONES'
        },
        ingresos: {
          total: ingresosActual,
          cambio: cambioIngresos,
          colorCambio: getColorPorCambio(cambioIngresos),
          label: 'INGRESOS'
        }
      });

      setLoading(false);
    };

    calcularEstadisticas();
  }, [
    selectedMonth,
    adminReservas, adminReservasStatus,
    adminUsers, adminUsersStatus,
    adminSalones, adminSalonesStatus,
    adminTransacciones, adminTransaccionesStatus
  ]);

  return { stats, loading, debugInfo };
};

export default useAdminStats;