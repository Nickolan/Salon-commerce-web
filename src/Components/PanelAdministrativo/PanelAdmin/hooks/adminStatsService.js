// src/services/adminStatsService.js
import axios from 'axios';
import { extractYearMonth } from '../hooks/dateUtils';

const API_URL = 'http://localhost:3000';

const AdminStatsService = {
  // Obtener token de autenticación
  getToken() {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    return localStorage.getItem('token');
  },

  // Obtener mes anterior en formato YYYY-MM
  getPreviousMonth(month) {
    if (!month) return null;
    
    const [year, monthNum] = month.split('-').map(Number);
    if (monthNum === 1) {
      return `${year - 1}-12`;
    } else {
      const prevMonth = monthNum - 1;
      return `${year}-${prevMonth.toString().padStart(2, '0')}`;
    }
  },

  // Obtener datos comparativos de reservas
  async fetchReservasComparativa(month) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No autenticado');

      console.log(`📊 Obteniendo reservas comparativas para ${month}`);
      
      // Obtener reservas del mes actual
      const currentResponse = await axios.get(`${API_URL}/reservas/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month }
      });

      // Obtener reservas del mes anterior
      const previousMonth = this.getPreviousMonth(month);
      const previousResponse = await axios.get(`${API_URL}/reservas/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { month: previousMonth }
      });

      return {
        current: currentResponse.data,
        previous: previousResponse.data
      };
    } catch (error) {
      console.error('❌ Error obteniendo reservas comparativas:', error);
      return { current: [], previous: [] };
    }
  },

  // Obtener datos comparativos de transacciones (ingresos)
  async fetchTransaccionesComparativa(month) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No autenticado');

      console.log(`📊 Obteniendo transacciones comparativas para ${month}`);
      
      const previousMonth = this.getPreviousMonth(month);

      const [currentResponse, previousResponse] = await Promise.all([
        axios.get(`${API_URL}/transacciones/admin`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { month }
        }),
        axios.get(`${API_URL}/transacciones/admin`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: previousMonth }
        })
      ]);

      return {
        current: currentResponse.data,
        previous: previousResponse.data
      };
    } catch (error) {
      console.error('❌ Error obteniendo transacciones comparativas:', error);
      return { current: [], previous: [] };
    }
  },

  // Obtener datos comparativos de salones (acumulado hasta el mes)
  async fetchSalonesComparativa(month) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No autenticado');

      console.log(`📊 Obteniendo salones comparativos para ${month}`);
      
      const previousMonth = this.getPreviousMonth(month);

      const [currentResponse, previousResponse] = await Promise.all([
        axios.get(`${API_URL}/salones/admin`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { month }
        }),
        axios.get(`${API_URL}/salones/admin`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: previousMonth }
        })
      ]);

      return {
        current: currentResponse.data,
        previous: previousResponse.data
      };
    } catch (error) {
      console.error('❌ Error obteniendo salones comparativos:', error);
      return { current: [], previous: [] };
    }
  },

  // Calcular todas las estadísticas de una vez
  async calculateAllStats(month, usersData) {
    try {
      console.log('📈 Calculando todas las estadísticas para', month);
      
      // Hacer todas las peticiones en paralelo
      const [reservasData, transaccionesData, salonesData] = await Promise.all([
        this.fetchReservasComparativa(month),
        this.fetchTransaccionesComparativa(month),
        this.fetchSalonesComparativa(month)
      ]);

      const previousMonth = this.getPreviousMonth(month);

      // Función para filtrar usuarios acumulados hasta el mes
      const filterUsersUpToMonth = (users, targetMonth) => {
        if (!users || !targetMonth) return [];
        
        return users.filter(user => {
          const fechaCampos = ['fecha_creacion', 'createdAt', 'fecha_registro', 'fecha_alta'];
          for (const campo of fechaCampos) {
            if (user[campo]) {
              const userMonth = extractYearMonth(user[campo]);
              if (userMonth && userMonth <= targetMonth) {
                return true;
              }
            }
          }
          return false;
        });
      };

      // Filtrar usuarios
      const usuariosActual = filterUsersUpToMonth(usersData, month);
      const usuariosAnterior = filterUsersUpToMonth(usersData, previousMonth);

      // Calcular totales
      const totalReservasActual = reservasData.current.length;
      const totalReservasAnterior = reservasData.previous.length;
      
      const totalUsuariosActual = usuariosActual.length;
      const totalUsuariosAnterior = usuariosAnterior.length;
      
      const totalSalonesActual = salonesData.current.length;
      const totalSalonesAnterior = salonesData.previous.length;
      
      const totalIngresosActual = transaccionesData.current.reduce((sum, t) => {
        const monto = t.monto_pagado || t.monto || 0;
        return sum + Number(monto);
      }, 0);
      
      const totalIngresosAnterior = transaccionesData.previous.reduce((sum, t) => {
        const monto = t.monto_pagado || t.monto || 0;
        return sum + Number(monto);
      }, 0);

      // Función para calcular cambio porcentual
      const calcularCambio = (actual, anterior) => {
        if (actual === 0 && anterior === 0) return '0%';
        if (anterior === 0) {
          if (actual > 0) return '+100%';
          return '0%';
        }
        
        const cambio = ((actual - anterior) / anterior) * 100;
        const cambioRedondeado = Math.round(cambio * 10) / 10;
        
        if (cambioRedondeado > 0) return `+${cambioRedondeado}%`;
        if (cambioRedondeado < 0) return `${cambioRedondeado}%`;
        return '0%';
      };

      const getColorPorCambio = (cambio) => {
        if (cambio.startsWith('+')) return '#085D14';
        if (cambio === '0%') return '#F1B300';
        return '#AD1519';
      };

      const cambioReservas = calcularCambio(totalReservasActual, totalReservasAnterior);
      const cambioUsuarios = calcularCambio(totalUsuariosActual, totalUsuariosAnterior);
      const cambioSalones = calcularCambio(totalSalonesActual, totalSalonesAnterior);
      const cambioIngresos = calcularCambio(totalIngresosActual, totalIngresosAnterior);

      return {
        reservas: {
          total: totalReservasActual,
          cambio: cambioReservas,
          colorCambio: getColorPorCambio(cambioReservas),
          label: 'Reservas'
        },
        usuarios: {
          total: totalUsuariosActual,
          cambio: cambioUsuarios,
          colorCambio: getColorPorCambio(cambioUsuarios),
          label: 'USUARIOS'
        },
        salones: {
          total: totalSalonesActual,
          cambio: cambioSalones,
          colorCambio: getColorPorCambio(cambioSalones),
          label: 'SALONES'
        },
        ingresos: {
          total: totalIngresosActual,
          cambio: cambioIngresos,
          colorCambio: getColorPorCambio(cambioIngresos),
          label: 'INGRESOS'
        }
      };
    } catch (error) {
      console.error('❌ Error calculando estadísticas:', error);
      return null;
    }
  }
};

export default AdminStatsService;