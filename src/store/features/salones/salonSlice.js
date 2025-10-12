import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/salones'; // URL del endpoint de salones

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

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
      

      const response = await axios.post(API_URL, salonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el salón.');
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
      });
  },
});

export const { resetSalonStatus } = salonSlice.actions;
export default salonSlice.reducer;