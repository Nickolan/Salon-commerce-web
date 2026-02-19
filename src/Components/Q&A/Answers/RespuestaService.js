import axios from 'axios';

const API_URL = 'http://localhost:3000';

const RespuestaService = {
  getToken() {
    // IMPORTANTE: Usar 'accessToken' para ser consistente con AuthSlice
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return localStorage.getItem('token');
    }
    return token;
  },

  async crearRespuesta(preguntaId, contenido, salonId) {
    const token = this.getToken();
    console.log('Token para crear respuesta:', token ? 'Presente' : 'Ausente');
    
    const preguntaIdNum = parseInt(preguntaId, 10);
    const salonIdNum = parseInt(salonId, 10);
    
    try {
      const response = await axios.post(
        `${API_URL}/questions/${preguntaId}/answer`,
        { 
          contenido,
          salon_id: salonIdNum,
          pregunta_id: preguntaIdNum
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error en crearRespuesta:', error.response?.data || error.message);
      throw error;
    }
  },

  async getRespuestasPorPregunta(preguntaId) {
    const response = await axios.get(`${API_URL}/questions/${preguntaId}/answers`);
    return response.data;
  },

  async getRespuestasPorSalon(salonId) {
    const response = await axios.get(`${API_URL}/questions/salon/${salonId}/answers`);
    return response.data;
  },

  async actualizarRespuesta(respuestaId, contenido) {
    const token = this.getToken();
    const response = await axios.put(
      `${API_URL}/questions/answers/${respuestaId}`,
      { contenido },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  async eliminarRespuesta(respuestaId) {
    const token = this.getToken();
    const response = await axios.delete(
      `${API_URL}/questions/answers/${respuestaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  }
};

export default RespuestaService;