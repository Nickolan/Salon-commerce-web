import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/salones'; // URL del endpoint de salones

const initialState = {
  salones: [],
  mySalones: [], 
  selectedSalon: null,
  resenias: [],
  resultadosSalones: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
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

      // 1. Usamos FormData para poder enviar archivos (fotos) y datos de texto.
      const formData = new FormData();

      // 2. Agregamos las fotos. El backend debe estar preparado para recibirlas bajo el campo 'files'.
      photos.forEach(photo => {
        formData.append('files', photo);
      });

      // 3. Agregamos el resto de los datos del salón como un objeto JSON convertido a string.
      // El backend deberá parsear este string para obtener los datos.
      formData.append('salon', JSON.stringify(salonData));
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      console.log(formData);

      console.log(salonData);
      
      

      const response = await axios.post(API_URL, salonData);
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
      });
  },
});

export const { resetSalonStatus } = salonSlice.actions;
export default salonSlice.reducer;