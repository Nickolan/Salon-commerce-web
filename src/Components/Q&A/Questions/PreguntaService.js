import axios from 'axios';

const API_URL = 'https://salon-commerce-server.onrender.com';

const PreguntaService = {
  getToken() {
    const token = localStorage.getItem('accessToken');
    if (token) return token;
    
    return localStorage.getItem('token');
  },

  async getPreguntasPorSalon(salonId) {
    try {
      const response = await axios.get(`${API_URL}/salons/${salonId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
      return [];
    }
  },

  async crearPregunta(salonId, contenido) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    console.log('Enviando pregunta con token:', token.substring(0, 20) + '...');
    console.log('Salon ID:', salonId);
    console.log('Contenido:', contenido);

    try {
      const response = await axios.post(
        `${API_URL}/salons/${salonId}/questions`,
        { 
          contenido: contenido,
          salon_id: parseInt(salonId)  
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear pregunta:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  async eliminarPregunta(preguntaId) {
    const token = this.getToken();
    try {
      const response = await axios.delete(
        `${API_URL}/salons/questions/${preguntaId}`,  // ✅ URL CORRECTA
        {
          headers: {
            'Authorization': `Bearer ${token}`  // ✅ Token incluido
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar pregunta:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  async actualizarPregunta(preguntaId, contenido) {
    const token = this.getToken();
    try {
      const response = await axios.put(
        `${API_URL}/salons/questions/${preguntaId}`,
        { contenido },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar pregunta:', error);
      throw error;
    }
  },

  async rechazarPregunta(preguntaId, motivoCategoria, motivoDetalle) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No autenticado');
    }

    try {
      const response = await axios.post(
        `${API_URL}/salons/questions/${preguntaId}/rechazar`,
        {
          motivo_categoria: motivoCategoria,
          motivo_detalle: motivoDetalle
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error en rechazarPregunta:', error.response?.data || error.message);
      throw error;
    }
  },

};

export default PreguntaService;