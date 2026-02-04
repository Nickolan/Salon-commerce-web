import axios from 'axios';

const API_URL = 'http://localhost:3000';

const PreguntaService = {
  getToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // También intenta con 'token' por si acaso
      return localStorage.getItem('token');
    }
    return token;
  },

  async getPreguntasPorSalon(salonId) {
    const response = await axios.get(`${API_URL}/salons/${salonId}/questions`);
    return response.data;
  },

  async crearPregunta(salonId, contenido) {
    const token = this.getToken();
    console.log('Token usado para crear pregunta:', token ? 'Presente' : 'Ausente');
    
    const response = await axios.post(
      `${API_URL}/salons/${salonId}/questions`,
      { contenido, salon_id: parseInt(salonId) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  async eliminarPregunta(preguntaId) {
    const token = this.getToken();
    console.log('Token usado para eliminar pregunta:', token ? 'Presente' : 'Ausente');
    
    const response = await axios.delete(
      `${API_URL}/salons/questions/${preguntaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async actualizarPregunta(preguntaId, contenido) {
    const token = this.getToken();
    const response = await axios.put(
      `${API_URL}/salons/questions/${preguntaId}`,
      { contenido },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
};

export default PreguntaService;