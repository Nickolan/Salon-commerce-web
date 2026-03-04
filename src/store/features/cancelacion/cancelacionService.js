import axios from 'axios';

const API_URL = 'http://localhost:3000';

const CancelacionService = {
  getToken() {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    return localStorage.getItem('token');
  },

  async cancelarReserva(id_reserva, motivo) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      console.log('🔄 Cancelando reserva:', { id_reserva, motivo });
      
      // 1. Crear la cancelación (esto actualizará la reserva automáticamente)
      const cancelacionResponse = await axios.post(
        `${API_URL}/cancelaciones`,
        { id_reserva, motivo },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 2. Actualizar el estado de la transacción a 'reembolso' si existe
      try {
        // Primero obtenemos la reserva actualizada para tener la transacción
        const reservaResponse = await axios.get(
          `${API_URL}/reservas/${id_reserva}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        const reserva = reservaResponse.data;
        
        if (reserva.transacciones && reserva.transacciones.length > 0) {
          const transaccion = reserva.transacciones[0];
          
          await axios.patch(
            `${API_URL}/transacciones/${transaccion.id_transaccion}`,
            { estado_transaccion: 'reembolso' },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('✅ Transacción actualizada a reembolso');
        }
      } catch (transError) {
        console.error('Error al actualizar transacción:', transError);
        // No lanzamos error aquí porque la cancelación ya se creó
      }

      return cancelacionResponse.data;
    } catch (error) {
      console.error('❌ Error en cancelación:', error.response?.data || error.message);
      throw error;
    }
  },

  async obtenerDetalleCancelacion(id_reserva) {
    try {
      const token = this.getToken();
      const response = await axios.get(
        `${API_URL}/cancelaciones/reserva/${id_reserva}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener cancelación:', error);
      return null;
    }
  },

  async calcularReembolso(id_reserva) {
    try {
      const token = this.getToken();
      const response = await axios.get(
        `${API_URL}/cancelaciones/calcular-reembolso/${id_reserva}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al calcular reembolso:', error);
      throw error;
    }
  },
  
  async obtenerCancelacionPorReserva(id_reserva) {
    const token = this.getToken();
    
    if (!token) {
        throw new Error('No autenticado');
    }

    try {
        console.log(`🔍 Obteniendo cancelación para reserva: ${id_reserva}`);
        const response = await axios.get(
        `${API_URL}/cancelaciones/reserva/${id_reserva}`,
        {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
        }
        );
        return response.data;
    } catch (error) {
        console.error('❌ Error al obtener cancelación:', error.response?.data || error.message);
        throw error;
    }
    }
};

export default CancelacionService;