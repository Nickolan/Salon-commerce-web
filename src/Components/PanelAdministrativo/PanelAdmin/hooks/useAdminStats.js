import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminStatsService from './adminStatsService';

const useAdminStats = (selectedMonth) => {
  const [stats, setStats] = useState({
    reservas: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'Reservas' },
    usuarios: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'USUARIOS' },
    salones: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'SALONES' },
    ingresos: { total: 0, cambio: '0%', colorCambio: '#F1B300', label: 'INGRESOS' }
  });
  const [loading, setLoading] = useState(true);

  // Acceder a los datos de Redux
  const { adminUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!selectedMonth) {
      setLoading(false);
      return;
    }

    const calcularEstadisticas = async () => {
      setLoading(true);
      
      console.log('=== CALCULANDO ESTADÍSTICAS CON SERVICIO ===');
      console.log('Mes seleccionado:', selectedMonth);

      // Verificar que tengamos usuarios
      if (!Array.isArray(adminUsers)) {
        console.log('Esperando datos de usuarios...');
        setLoading(false);
        return;
      }

      // Calcular estadísticas usando el servicio
      const calculatedStats = await AdminStatsService.calculateAllStats(selectedMonth, adminUsers);
      
      if (calculatedStats) {
        console.log('=== ESTADÍSTICAS CALCULADAS ===', calculatedStats);
        setStats(calculatedStats);
      }

      setLoading(false);
    };

    calcularEstadisticas();
  }, [selectedMonth, adminUsers]);

  return { stats, loading };
};

export default useAdminStats;