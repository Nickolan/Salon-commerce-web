import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// --- Estado Inicial ---
// Intentamos obtener el token del localStorage para mantener la sesión
const userToken = localStorage.getItem('accessToken');
const initialState = {
  user: null,
  token: userToken || null,
  isAuthenticated: !!userToken,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const API_URL = 'http://localhost:3000/usuarios';
// --- Thunk Asíncrono para el Login ---
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {

      // 1. Hacemos la petición de login para obtener el token
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { accessToken } = response.data;

      // 2. Guardamos el token en localStorage
      localStorage.setItem('accessToken', accessToken);

      // 3. Decodificamos el token para obtener el ID del usuario
      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.id;

      // 4. Hacemos una segunda petición para obtener los datos completos del usuario
      const userResponse = await axios.get(`${API_URL}/${userId}`);

      // Retornamos el token y los datos del usuario
      return { token: accessToken, user: userResponse.data };
    } catch (error) {
      // Si hay un error, lo pasamos al estado de 'rejected'
      return rejectWithValue(error.response?.data?.message || 'Error desconocido en el login');
    }
  }
);

// --- 👇 THUNK ASÍNCRONO NUEVO PARA ACTUALIZAR EL USUARIO ---
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ id, userData }, { getState, rejectWithValue }) => {
    try {
      // Obtenemos el token del estado actual de Redux
      const { token } = getState().auth;

      if (!token) {
        return rejectWithValue('No se encontró token de autenticación.');
      }

      // Hacemos la petición PATCH, incluyendo el token en las cabeceras
      const response = await axios.patch(`${API_URL}/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Retornamos los datos actualizados del usuario que devuelve el backend
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el perfil.');
    }
  }
);

// --- Creación del Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reductores síncronos
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  // Reductores para manejar las acciones asíncronas del thunk
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // El mensaje de error viene del rejectWithValue
      })
      // --- 👇 CASOS NUEVOS PARA updateUser ---
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading'; // Reutilizamos el estado 'loading'
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Actualizamos los datos del usuario en el store
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;