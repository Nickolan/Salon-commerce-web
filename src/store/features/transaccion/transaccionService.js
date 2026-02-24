import axios from 'axios';

const API_URL = 'http://localhost:3000';

const TransaccionService = {
  getToken() {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    return localStorage.getItem('token');
  },

  getReservaIdFromTransaccion(transaccion) {
    if (!transaccion) return null;
    
    const posiblesCampos = [
      'reservaldReserva',      
      'reserva_id_reserva',    
      'reservaIdReserva',      
      'id_reserva',            
      'reserva',               
      'reservaId',             
    ];
    
    for (const campo of posiblesCampos) {
      if (transaccion[campo] !== undefined) {
        if (typeof transaccion[campo] === 'number') {
          return transaccion[campo];
        }
        if (typeof transaccion[campo] === 'object' && transaccion[campo] !== null) {
          return transaccion[campo].id_reserva || transaccion[campo].id;
        }
      }
    }
    
    if (transaccion.reserva && typeof transaccion.reserva === 'object') {
      return transaccion.reserva.id_reserva || transaccion.reserva.id;
    }
    
    console.warn('No se pudo encontrar ID de reserva en transacción:', transaccion);
    return null;
  },

  combinarReservasConTransacciones(reservas, transacciones) {
    console.log('🔄 Combinando reservas con transacciones...');
    console.log('Reservas:', reservas?.length || 0);
    console.log('Transacciones:', transacciones?.length || 0);
    
    if (!reservas || reservas.length === 0) {
      return [];
    }
    
    if (!transacciones || transacciones.length === 0) {
      console.log('⚠️ No hay transacciones, devolviendo reservas sin combinar');
      return reservas.map(r => ({ ...r, transacciones: [] }));
    }
    
    const transaccionesPorReserva = new Map();
    
    transacciones.forEach(trans => {
      const reservaId = this.getReservaIdFromTransaccion(trans);
      if (reservaId) {
        if (!transaccionesPorReserva.has(reservaId)) {
          transaccionesPorReserva.set(reservaId, []);
        }
        transaccionesPorReserva.get(reservaId).push(trans);
        console.log(`✅ Transacción ${trans.id_transaccion} → Reserva ${reservaId}`);
      } else {
        console.log(`❌ Transacción ${trans.id_transaccion} no tiene ID de reserva válido`);
      }
    });
    
    const resultado = reservas.map(reserva => {
      const transaccionesReserva = transaccionesPorReserva.get(reserva.id_reserva) || [];
      console.log(`Reserva ${reserva.id_reserva}: ${transaccionesReserva.length} transacciones`);
      
      return {
        ...reserva,
        transacciones: transaccionesReserva
      };
    });
    
    console.log('✅ Combinación completada');
    return resultado;
  },

  getMontoReserva(reserva) {
    if (!reserva) return 0;
    
    if (reserva.transacciones && reserva.transacciones.length > 0) {
      const monto = reserva.transacciones[0].monto_pagado;
      if (monto) return monto;
    }
    
    if (reserva.transaccion) {
      return reserva.transaccion.monto_pagado || 0;
    }
    
    return 0;
  },

  getEstadoTransaccion(reserva) {
    if (!reserva) return null;
    
    if (reserva.transacciones && reserva.transacciones.length > 0) {
      return reserva.transacciones[0].estado_transaccion;
    }
    
    if (reserva.transaccion) {
      return reserva.transaccion.estado_transaccion;
    }
    
    return null;
  },

  // Obtener transacciones por mes (admin)
  async fetchTransaccionesByMonth(month) {
    try {
      console.log(`🔄 Obteniendo transacciones del mes: ${month}`);
      const response = await axios.get(`${API_URL}/transacciones/admin?month=${month}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener transacciones:', error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar una transacción por ID
  async updateTransaccion(id_transaccion, data) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      console.log(`🔄 Actualizando transacción ${id_transaccion}:`, data);
      const response = await axios.patch(
        `${API_URL}/transacciones/${id_transaccion}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar transacción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Actualizar estado de transacción por ID de reserva
  async updateEstadoByReservaId(id_reserva, nuevoEstado) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      console.log(`🔄 Actualizando estado de transacción para reserva ${id_reserva} a: ${nuevoEstado}`);
      
      // Prueba con diferentes formatos de URL si es necesario
      const url = `${API_URL}/transacciones/reserva/${id_reserva}/estado`;
      // Alternativas:
      // const url = `${API_URL}/transacciones/reserva/${id_reserva}`;
      // const url = `${API_URL}/transacciones/por-reserva/${id_reserva}`;
      
      console.log('📡 URL:', url);
      
      const response = await axios.patch(
        url,
        { estado_transaccion: nuevoEstado },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar estado de transacción:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Método combinado para cancelar reserva y actualizar transacción
  async cancelarReservaYTransaccion(reserva, nuevoEstadoReserva, nuevoEstadoTransaccion = 'rechazado') {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      console.log('🔄 Iniciando cancelación de reserva y transacción:', { 
        id_reserva: reserva.id_reserva, 
        nuevoEstadoReserva,
        nuevoEstadoTransaccion
      });

      // URL que estamos intentando
      const url = `${API_URL}/reservas/${reserva.id_reserva}`;
      console.log('📡 Intentando PATCH a:', url);
      console.log('📦 Datos a enviar:', { estado_reserva: nuevoEstadoReserva });

      // 1. Actualizar estado de la reserva
      const reservaResponse = await axios.patch(
        url,
        { estado_reserva: nuevoEstadoReserva },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Reserva actualizada:', reservaResponse.data);

      // 2. Si hay transacción asociada, actualizar su estado
      let transaccionResponse = null;
      if (reserva.transacciones && reserva.transacciones.length > 0) {
        transaccionResponse = await this.updateEstadoByReservaId(
          reserva.id_reserva, 
          nuevoEstadoTransaccion
        );
        console.log('✅ Transacción actualizada:', transaccionResponse);
      }

      return {
        reserva: reservaResponse.data,
        transaccion: transaccionResponse || null
      };
      
    } catch (error) {
      console.error('❌ Error en cancelarReservaYTransaccion:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
};

export default TransaccionService;