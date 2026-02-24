import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://salon-commerce-server.onrender.com/favoritos';

// THUNK para OBTENER los favoritos del usuario
export const fetchFavoritos = createAsyncThunk(
  'favoritos/fetchFavoritos',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      console.log(auth);
      
      if (!auth.isAuthenticated || !auth.user?.id_usuario) {
        return rejectWithValue('Usuario no autenticado.');
      }
      
      // --- 👇 LÍNEA MODIFICADA ---
      // Ahora la petición se hace a la nueva ruta segura que no necesita el ID en la URL
      console.log(auth);
      
      const response = await axios.get(`${API_URL}/mis-favoritos`, {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
      });
      // --------------------------
      return response.data;
    } catch (error) {
        console.log(error);
        
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


// THUNK para AÑADIR un favorito
export const addFavorito = createAsyncThunk(
  'favoritos/addFavorito',
  async (id_salon, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const payload = {
        id_usuario: auth.user.id_usuario,
        id_salon: id_salon,
      };

      console.log(payload);
      
      const response = await axios.post(API_URL, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// THUNK para QUITAR un favorito
export const removeFavorito = createAsyncThunk(
  'favoritos/removeFavorito',
  async ({ id_favorito, id_salon }, { rejectWithValue }) => {
    try {
      // El endpoint del backend espera el ID del favorito, no del salón
      await axios.delete(`${API_URL}/${id_favorito}`);
      return { id_salon }; // Devolvemos el id_salon para poderlo quitar del estado local
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


const initialState = {
  favoritos: [], // Almacenará la lista de objetos favoritos
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const favoritosSlice = createSlice({
  name: 'favoritos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Casos para fetchFavoritos
      .addCase(fetchFavoritos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavoritos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.favoritos = action.payload;
      })
      .addCase(fetchFavoritos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Caso para addFavorito (añade el nuevo favorito a la lista)
      .addCase(addFavorito.fulfilled, (state, action) => {
        state.favoritos.push(action.payload);
      })
      // Caso para removeFavorito (filtra y quita el favorito de la lista)
      .addCase(removeFavorito.fulfilled, (state, action) => {
        state.favoritos = state.favoritos.filter(
          (fav) => fav.salon.id_salon !== action.payload.id_salon
        );
      });
  },
});

export default favoritosSlice.reducer;