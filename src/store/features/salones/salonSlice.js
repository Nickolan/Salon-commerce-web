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
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  reseniaStatus: 'idle',
  reseniaError: null,
};

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
      });
  },
});

export const { resetSalonStatus } = salonSlice.actions;
export default salonSlice.reducer;