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
  adminUsers: [], // <-- NUEVO ESTADO
  adminUsersStatus: 'idle', // <-- NUEVO ESTADO
  adminUsersError: null, // <-- NUEVO ESTADO
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

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const payload = { ...userData, contrasenia: userData.contraseña };
      delete payload.contraseña;

      const response = await axios.post(`${API_URL}/registro`, payload);
      // La respuesta ahora contiene { accessToken, user }
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error desconocido en el registro');
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

export const revalidateSession = createAsyncThunk(
  'auth/revalidateSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return rejectWithValue('No se encontró token.');
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Llamamos al nuevo endpoint '/perfil'
      const response = await axios.get(`${API_URL}/perfil`, config);
      
      console.log('✅ [revalidateSession] Datos recibidos de la API:', response.data); // Log 1

      return { user: response.data, token };
    } catch (error) {
      // Si el token es inválido o expiró, la API devolverá un error 401
      return rejectWithValue(error.response?.data?.message || 'Sesión inválida.');
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  'auth/uploadProfilePic',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue('No se encontró token de autenticación.');
      }

      // IMPORTANTE: Al enviar FormData, axios configura el Content-Type automáticamente
      const response = await axios.post(
        `${API_URL}/upload-perfil-pic`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Asegurarse de setear esto
          },
        }
      );

      // El backend devuelve el usuario actualizado (sin contraseña)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al subir la imagen.');
    }
  }
);

export const fetchAdminUsersByMonth = createAsyncThunk(
  'auth/fetchAdminUsersByMonth',
  async (month, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Asumiendo que necesitas token para admin
      if (!token) return rejectWithValue('No autenticado.');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { month } // Enviar mes como query param
      };
      // Ajusta la URL si tu endpoint es diferente (ej. /admin/usuarios)
      const response = await axios.get(`${API_URL}/admin`, config); // O ${API_URL}/admin?month=${month}
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar usuarios admin.');
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
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        // La lógica es idéntica a la de un login exitoso
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      .addCase(revalidateSession.pending, (state) => {
        state.status = 'revalidating'; // Un estado específico para no mostrar "cargando..." en toda la app
      })
      .addCase(revalidateSession.fulfilled, (state, action) => {
        console.log('✅ [Reducer] Actualizando estado con:', action.payload.user); // Log 3
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(revalidateSession.rejected, (state) => {
        console.log("limpiando todo");
        
        // Si la revalidación falla, limpiamos todo
        state.status = 'idle';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('accessToken');
      })
      .addCase(uploadProfilePic.pending, (state) => {
        state.status = 'loading'; // Podemos reusar el status 'loading'
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Actualiza el usuario en el store con la nueva foto
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAdminUsersByMonth.pending, (state) => {
        state.adminUsersStatus = 'loading';
      })
      .addCase(fetchAdminUsersByMonth.fulfilled, (state, action) => {
        state.adminUsersStatus = 'succeeded';
        state.adminUsers = action.payload;
        state.adminUsersError = null;
      })
      .addCase(fetchAdminUsersByMonth.rejected, (state, action) => {
        state.adminUsersStatus = 'failed';
        state.adminUsersError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;