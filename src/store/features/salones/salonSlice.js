import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/salones'; // URL del endpoint de salones
const RESENIAS_API_URL = 'http://localhost:3000/resenias';

const initialState = {
  salones: [],
  mySalones: [],
  selectedSalon: null,
  resenias: [],
  resultadosSalones: [],
  destacados: [],
  visitados: [],
  cercanos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  reseniaStatus: 'idle',
  reseniaError: null,
  adminSalones: [], // Lista completa para admin
  adminStatus: 'idle',
  adminError: null,
  adminSalonesStatus: 'idle', // <-- NUEVO ESTADO
  adminSalonesError: null, // <-- NUEVO ESTADO
};

export const fetchAdminSalonsByMonth = createAsyncThunk(
  'salones/fetchAdminSalonsByMonth',
  async (month, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('No autenticado.');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { month }
      };
      // Ajusta la URL si es necesario (ej. /admin/salones)
      const response = await axios.get(`${API_URL}/admin`, config); // O ${API_URL}/admin?month=${month}
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar salones admin.');
    }
  }
);

export const updateSalon = createAsyncThunk(
  'salones/updateSalon',
  async ({ salonId, formData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('No autenticado.');

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios lo detecta, pero puede ser explícito
          Authorization: `Bearer ${token}`,
        },
      };
      // Usamos PATCH para actualizaciones parciales
      const response = await axios.patch(`${API_URL}/${salonId}`, formData, config);
      return response.data; // Devuelve el salón actualizado
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el salón.');
    }
  }
);

const getAllSalonesAdmin = async (token, estado) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {} // Parámetros de query
  };
  if (estado) {
    config.params.estado = estado; // Añadir filtro si se proporciona
  }
  const response = await axios.get(API_URL, config);
  return response.data;
};

const updateSalonStatus = async (salonId, nuevoEstado, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.patch(`${API_URL}/${salonId}/estado`, { estado_publicacion: nuevoEstado }, config);
  return response.data;
};

export const fetchAllSalonesAdmin = createAsyncThunk(
  'salones/fetchAllSalonesAdmin',
  async (estado, { getState, rejectWithValue }) => { // Recibe 'estado' opcional
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No autenticado.');
      // Llama al nuevo método del servicio
      return await getAllSalonesAdmin(token, estado);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const updateSalonStatusAdmin = createAsyncThunk(
  'salones/updateSalonStatusAdmin',
  async ({ salonId, nuevoEstado }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No autenticado.');
      // Llama al nuevo método del servicio
      return await updateSalonStatus(salonId, nuevoEstado, token);
    } catch (error) {
      console.log(error);

      const message = error.response?.data?.message || error.message || error.toString();
      return rejectWithValue(message);
    }
  }
);

export const fetchReseniasBySalonId = createAsyncThunk(
  'salones/fetchReseniasBySalonId',
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/resenias/salon/${salonId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar las reseñas.');
    }
  }
);

export const createResenia = createAsyncThunk(
  'salones/createResenia',
  async (reseniaData, { getState, rejectWithValue }) => {
    // reseniaData = { id_reserva, calificacion, comentario }
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        return rejectWithValue('No estás autenticado.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(RESENIAS_API_URL, reseniaData, config);
      return response.data; // Devuelve la reseña creada
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al publicar la reseña.');
    }
  }
);

export const fetchSalonById = createAsyncThunk(
  'salones/fetchSalonById',
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${salonId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar el salón.');
    }
  }
);

export const fetchSalones = createAsyncThunk(
  'salones/fetchSalones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data; // Esto será el array de salones
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar los salones.');
    }
  }
);

export const fetchMySalones = createAsyncThunk(
  'salones/fetchMySalones',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        return rejectWithValue('No hay token de autenticación.');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/mis-salones`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar mis salones.');
    }
  }
);

// --- Thunk Asíncrono para CREAR un Salón ---
export const createSalon = createAsyncThunk(
  'salones/createSalon',
  async ({ salonData, photos }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        return rejectWithValue('No estás autenticado para realizar esta acción.');
      }

      const formData = new FormData();

      // --- 👇 ESTO ESTÁ CORRECTO ---
      // 1. Agregamos las fotos. La clave 'files' DEBE COINCIDIR con el FilesInterceptor del backend.
      // Lo he unificado a 'files' en el backend controller, pero si lo cambias a 'fotos' aquí,
      // debes cambiarlo en el FileInterceptor('fotos', 5) del backend. Usaremos 'files' por ahora.
      photos.forEach(photo => {
        formData.append('files', photo);
      });

      // 2. Agregamos los datos del salón como un string JSON. La clave 'salon' DEBE COINCIDIR con el @Body('salon') del backend.
      formData.append('salon', JSON.stringify(salonData));
      // --- 👆 ESTO ESTÁ CORRECTO ---

      const config = {
        headers: {
          // No seteamos Content-Type, Axios lo hace automáticamente para FormData
          Authorization: `Bearer ${token}`,
        },
      };

      // --- 👇 AQUÍ ESTABA EL ERROR ---
      // Antes enviabas 'salonData', ahora enviamos 'formData'
      const response = await axios.post(API_URL, formData, config);
      // --- 👆 CORRECCIÓN APLICADA ---

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el salón.');
    }
  }
);

export const searchSalones = createAsyncThunk(
  'salones/searchSalones',
  async ({ lat, lng, capacidad }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/buscar`, {
        params: { lat, lng, capacidad },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al realizar la búsqueda.');
    }
  }
);

export const fetchDestacados = createAsyncThunk(
  'salones/fetchDestacados',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/destacados`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar destacados.');
    }
  }
);

export const fetchVisitados = createAsyncThunk(
  'salones/fetchVisitados',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No autenticado.');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/visitados`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar visitados.');
    }
  }
);

export const fetchCercanos = createAsyncThunk(
  'salones/fetchCercanos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      if (!token) return rejectWithValue('No autenticado.');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/cercanos`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cercanos.');
    }
  }
);

const salonSlice = createSlice({
  name: 'salones',
  initialState,
  reducers: {
    // Reducer para resetear el estado si el usuario navega a otra página
    resetSalonStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.reseniaStatus = 'idle';
      state.reseniaError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSalon.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSalon.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createSalon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSalones.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalones.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salones = action.payload; // Guardamos los salones en el estado
      })
      .addCase(fetchSalones.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMySalones.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMySalones.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.mySalones = action.payload; // Guardamos los salones en el nuevo estado
      })
      .addCase(fetchMySalones.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSalonById.pending, (state) => {
        state.status = 'loading';
        state.selectedSalon = null; // Limpiamos el salón anterior
      })
      .addCase(fetchSalonById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedSalon = action.payload; // Guardamos el salón encontrado
      })
      .addCase(fetchSalonById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchReseniasBySalonId.pending, (state) => {
        // No es necesario cambiar el status global, la UI puede manejar su propio estado de carga para las reseñas
      })
      .addCase(fetchReseniasBySalonId.fulfilled, (state, action) => {
        state.resenias = action.payload; // Guardamos las reseñas en el estado
      })
      .addCase(fetchReseniasBySalonId.rejected, (state, action) => {
        // Podríamos guardar el error de las reseñas en un campo separado si fuera necesario
        console.error("Error al cargar reseñas:", action.payload);
        state.resenias = [];
      })
      .addCase(searchSalones.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchSalones.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.resultadosSalones = action.payload; // Guardamos los resultados
      })
      .addCase(searchSalones.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.resultadosSalones = []; // Limpiamos resultados en caso de error
      })
      .addCase(createResenia.pending, (state) => {
        state.reseniaStatus = 'loading';
        state.reseniaError = null;
      })
      .addCase(createResenia.fulfilled, (state, action) => {
        state.reseniaStatus = 'succeeded';
        // Opcional: podríamos querer actualizar la lista de reseñas del salón
        state.resenias.push(action.payload);
      })
      .addCase(createResenia.rejected, (state, action) => {
        state.reseniaStatus = 'failed';
        state.reseniaError = action.payload;
      })
      .addCase(fetchDestacados.fulfilled, (state, action) => {
        state.destacados = action.payload;
      })
      .addCase(fetchVisitados.fulfilled, (state, action) => {
        state.visitados = action.payload;
      })
      .addCase(fetchCercanos.fulfilled, (state, action) => {
        state.cercanos = action.payload;
      })
      // (Opcional: puedes manejar los estados 'pending' y 'rejected' para cada uno si necesitas mostrar spinners/errores individuales)
      .addCase(fetchDestacados.rejected, (state, action) => { console.error("Error destacados:", action.payload) })
      .addCase(fetchVisitados.rejected, (state, action) => { console.error("Error visitados:", action.payload) })
      .addCase(fetchCercanos.rejected, (state, action) => { console.error("Error cercanos:", action.payload) })
      .addCase(fetchAllSalonesAdmin.pending, (state) => {
        state.adminStatus = 'loading';
      })
      .addCase(fetchAllSalonesAdmin.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        state.adminSalones = action.payload;
      })
      .addCase(fetchAllSalonesAdmin.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload;
      })
      .addCase(updateSalonStatusAdmin.pending, (state) => {
        // Podrías tener un estado específico para la actualización
        state.adminStatus = 'loading'; // O usar status general
      })
      .addCase(updateSalonStatusAdmin.fulfilled, (state, action) => {
        state.adminStatus = 'succeeded';
        // Actualizar el salón modificado en la lista adminSalones
        const index = state.adminSalones.findIndex(s => s.id_salon === action.payload.id_salon);
        if (index !== -1) {
          state.adminSalones[index] = action.payload;
        }
        // También actualizarlo en la lista pública si existe y está aprobado
        const publicIndex = state.salones.findIndex(s => s.id_salon === action.payload.id_salon);
        if (publicIndex !== -1 && action.payload.estado_publicacion === 'aprobada') {
          state.salones[publicIndex] = action.payload;
        } else if (publicIndex !== -1 && action.payload.estado_publicacion !== 'aprobada') {
          // Si deja de estar aprobado, quitarlo de la lista pública
          state.salones.splice(publicIndex, 1);
        }
      })
      .addCase(updateSalonStatusAdmin.rejected, (state, action) => {
        state.adminStatus = 'failed';
        state.adminError = action.payload; // Guardar error específico de actualización
      })
      .addCase(updateSalon.pending, (state) => {
        state.status = 'loading'; // O un estado 'updating'
      })
      .addCase(updateSalon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedSalon = action.payload; // Actualiza el salón seleccionado si estaba cargado
        // Actualiza el salón en la lista 'mySalones'
        const index = state.mySalones.findIndex(s => s.id_salon === action.payload.id_salon);
        if (index !== -1) {
          state.mySalones[index] = action.payload;
        }
        // Opcional: Actualizar también en 'salones' si aplica
      })
      .addCase(updateSalon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAdminSalonsByMonth.pending, (state) => {
          state.adminSalonesStatus = 'loading'; // Usar nuevo status
      })
      .addCase(fetchAdminSalonsByMonth.fulfilled, (state, action) => {
          state.adminSalonesStatus = 'succeeded'; // Usar nuevo status
          state.adminSalones = action.payload; // Sobrescribir con datos del mes
          state.adminSalonesError = null; // Usar nuevo error
      })
      .addCase(fetchAdminSalonsByMonth.rejected, (state, action) => {
          state.adminSalonesStatus = 'failed'; // Usar nuevo status
          state.adminSalonesError = action.payload; // Usar nuevo error
      })
  },
});

export const { resetSalonStatus } = salonSlice.actions;
export default salonSlice.reducer;