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

  combinarReservasConTransacciones(reservas, transacciones, salones = [], usuarios = [], resenias = []) {
    console.log('🔄 Combinando reservas con transacciones y enriqueciendo...');
    console.log('Reservas:', reservas?.length || 0);
    console.log('Transacciones:', transacciones?.length || 0);
    console.log('Salones:', salones?.length || 0);
    console.log('Usuarios:', usuarios?.length || 0);
    console.log('Reseñas:', resenias?.length || 0);
    
    if (!reservas || reservas.length === 0) {
      return [];
    }
    
    // Crear mapa de salones
    const salonesMap = new Map();
    if (salones && salones.length > 0) {
      salones.forEach(salon => {
        salonesMap.set(salon.id_salon, salon);
      });
    }
    
    // Crear mapa de usuarios
    const usuariosMap = new Map();
    if (usuarios && usuarios.length > 0) {
      usuarios.forEach(usuario => {
        usuariosMap.set(usuario.id_usuario, usuario);
      });
    }
    
    // Crear mapa de reseñas por ID de reserva
    const reseniasPorReserva = new Map();
    if (resenias && resenias.length > 0) {
      resenias.forEach(resenia => {
        if (resenia.id_reserva) {
          if (!reseniasPorReserva.has(resenia.id_reserva)) {
            reseniasPorReserva.set(resenia.id_reserva, []);
          }
          reseniasPorReserva.get(resenia.id_reserva).push(resenia);
          console.log(`⭐ Reseña ${resenia.id_resenia} → Reserva ${resenia.id_reserva}`);
        }
      });
    }
    
    // Mapa de transacciones por reserva
    const transaccionesPorReserva = new Map();
    if (transacciones && transacciones.length > 0) {
      transacciones.forEach(trans => {
        const reservaId = this.getReservaIdFromTransaccion(trans);
        if (reservaId) {
          if (!transaccionesPorReserva.has(reservaId)) {
            transaccionesPorReserva.set(reservaId, []);
          }
          transaccionesPorReserva.get(reservaId).push(trans);
        }
      });
    }
    
    const resultado = reservas.map(reserva => {
      const reservaEnriquecida = {
        ...reserva,
        transacciones: transaccionesPorReserva.get(reserva.id_reserva) || [],
        resenias: reseniasPorReserva.get(reserva.id_reserva) || []  // AÑADIR RESEÑAS
      };
      
      // Enriquecer salón
      if (reserva.salon && typeof reserva.salon === 'object') {
        const salonId = reserva.salon.id_salon;
        if (salonId) {
          const salonCompleto = salonesMap.get(salonId);
          if (salonCompleto) {
            reservaEnriquecida.salon = salonCompleto;
          }
        }
      }
      
      // Enriquecer arrendatario
      if (reserva.arrendatario && typeof reserva.arrendatario === 'object') {
        const usuarioId = reserva.arrendatario.id_usuario;
        if (usuarioId) {
          const usuarioCompleto = usuariosMap.get(usuarioId);
          if (usuarioCompleto) {
            reservaEnriquecida.arrendatario = usuarioCompleto;
          }
        }
      }
      
      // Log para verificar reseñas
      if (reservaEnriquecida.resenias.length > 0) {
        console.log(`📝 Reserva ${reserva.id_reserva} tiene ${reservaEnriquecida.resenias.length} reseñas`);
      }
      
      return reservaEnriquecida;
    });
    
    console.log('✅ Enriquecimiento completado');
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

  async updateEstadoByReservaId(id_reserva, nuevoEstado) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      console.log(`🔄 Actualizando estado de transacción para reserva ${id_reserva} a: ${nuevoEstado}`);
      
      const url = `${API_URL}/transacciones/reserva/${id_reserva}/estado`;
      
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

      const url = `${API_URL}/reservas/${reserva.id_reserva}`;
      console.log('📡 Intentando PATCH a:', url);
      console.log('📦 Datos a enviar:', { estado_reserva: nuevoEstadoReserva });

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
  },

  calcularEstadisticasTransacciones(transacciones, reservasDelSalon) {
    if (!transacciones || transacciones.length === 0 || !reservasDelSalon || reservasDelSalon.length === 0) {
      return {
        totalTransacciones: 0,
        ingresosTotales: 0,
        ultimoIngreso: 0,
        ultimaTransaccion: null
      };
    }

    const reservasIds = reservasDelSalon.map(r => r.id_reserva);
    
    const transaccionesSalon = transacciones.filter(t => 
      reservasIds.includes(t.id_reserva) || 
      reservasIds.includes(t.reservaIdReserva) ||
      reservasIds.includes(t.reserva_id_reserva)
    );

    const ingresosTotales = transaccionesSalon.reduce((sum, t) => sum + (t.monto_pagado || 0), 0);

    const transaccionesOrdenadas = [...transaccionesSalon].sort(
      (a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion)
    );

    const ultimaTransaccion = transaccionesOrdenadas[0];

    return {
      totalTransacciones: transaccionesSalon.length,
      ingresosTotales,
      ultimoIngreso: ultimaTransaccion?.monto_pagado || 0,
      ultimaTransaccion: ultimaTransaccion ? {
        id: ultimaTransaccion.id_transaccion,
        fecha: ultimaTransaccion.fecha_transaccion,
        monto: ultimaTransaccion.monto_pagado,
        metodo: ultimaTransaccion.metodo_pago
      } : null
    };
  }
};

export default TransaccionService;