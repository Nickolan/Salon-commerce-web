import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/reservas';
const FRANJAS_API_URL = 'http://localhost:3000/franjas-horarias';

// Thunk para buscar franjas disponibles
export const fetchAvailableSlots = createAsyncThunk(
  'reservas/fetchAvailableSlots',
  async (id_salon, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${FRANJAS_API_URL}/disponibles/${id_salon}`);
      // Convertimos las fechas string a objetos Date para el calendario
      
      return response.data.map(slot => ({
        ...slot,
        start: new Date(slot.start),
        end: new Date(slot.end),
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar disponibilidad.');
    }
  }
);

// Thunk para crear una reserva
export const createReserva = createAsyncThunk(
  'reservas/createReserva',
  async ({ id_salon, fecha_reserva, hora_inicio, hora_fin, id_arrendatario }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        id_salon,
        fecha_reserva, // Asegúrate que sea solo la fecha YYYY-MM-DD si es necesario
        hora_inicio, // Formato HH:mm
        hora_fin,   // Formato HH:mm
        estado_reserva: 'creada', // O el estado inicial que definas
        id_arrendatario
      };

      console.log(payload);
      
      const response = await axios.post(API_URL, payload, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear la reserva.');
    }
  }
);

export const fetchMisReservas = createAsyncThunk(
  'reservas/fetchMisReservas',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/mis-reservas`, config); // Llamada al nuevo endpoint
      return response.data; // Array de reservas
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar mis reservas.');
    }
  }
);

export const fetchReservaById = createAsyncThunk(
  'reservas/fetchReservaById',
  async (id_reserva, { rejectWithValue }) => {
    try {
      // Usamos el endpoint GET /reservas/:id que ya existe
      const response = await axios.get(`${API_URL}/${id_reserva}`);
      // Asumimos que la respuesta incluye las relaciones necesarias (salon, arrendatario)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar la reserva.');
    }
  }
);

export const fetchReservasRecibidas = createAsyncThunk(
  'reservas/fetchReservasRecibidas',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Llamada al nuevo endpoint '/recibidas'
      const response = await axios.get(`${API_URL}/recibidas`, config);
      return response.data; // Array de reservas recibidas
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar las reservaciones recibidas.');
    }
  }
);


const initialState = {
  availableSlots: [],
  selectedSlot: null,
  misReservas: [],
  selectedReserva: null, // 👈 Añadir estado para la reserva detallada
  reservaStatus: 'idle',
  slotsStatus: 'idle',
  misReservasStatus: 'idle',
  selectedReservaStatus: 'idle', // 👈 Añadir estado de carga específico
  error: null,
  reservasRecibidas: [], // 👈 Añadir estado para reservas recibidas
  reservasRecibidasStatus: 'idle',
};

const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    selectSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    clearSelectedSlot: (state) => {
      state.selectedSlot = null;
    },
    resetReservaStatus: (state) => {
      state.reservaStatus = 'idle';
      state.error = null;
    },
    clearSelectedReserva: (state) => {
        state.selectedReserva = null;
        state.selectedReservaStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.slotsStatus = 'loading';
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.slotsStatus = 'succeeded';
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.slotsStatus = 'failed';
        state.error = action.payload;
      })
      // Create Reserva
      .addCase(createReserva.pending, (state) => {
        state.reservaStatus = 'loading';
      })
      .addCase(createReserva.fulfilled, (state) => {
        state.reservaStatus = 'succeeded';
        state.selectedSlot = null; // Limpiar selección
        // Podríamos invalidar/recargar los slots aquí si fuera necesario
      })
      .addCase(createReserva.rejected, (state, action) => {
        state.reservaStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMisReservas.pending, (state) => {
        state.misReservasStatus = 'loading';
      })
      .addCase(fetchMisReservas.fulfilled, (state, action) => {
        state.misReservasStatus = 'succeeded';
        state.misReservas = action.payload;
      })
      .addCase(fetchMisReservas.rejected, (state, action) => {
        state.misReservasStatus = 'failed';
        state.error = action.payload; // Podrías usar un error específico si quieres
      })
      .addCase(fetchReservaById.pending, (state) => {
        state.selectedReservaStatus = 'loading';
        state.selectedReserva = null; // Limpiar la anterior mientras carga
      })
      .addCase(fetchReservaById.fulfilled, (state, action) => {
        state.selectedReservaStatus = 'succeeded';
        state.selectedReserva = action.payload;
      })
      .addCase(fetchReservaById.rejected, (state, action) => {
        state.selectedReservaStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchReservasRecibidas.pending, (state) => {
        state.reservasRecibidasStatus = 'loading';
      })
      .addCase(fetchReservasRecibidas.fulfilled, (state, action) => {
        state.reservasRecibidasStatus = 'succeeded';
        state.reservasRecibidas = action.payload;
      })
      .addCase(fetchReservasRecibidas.rejected, (state, action) => {
        state.reservasRecibidasStatus = 'failed';
        state.error = action.payload; // Consider using a specific error state if needed
      });
  },
});

export const { selectSlot, clearSelectedSlot, resetReservaStatus, clearSelectedReserva } = reservasSlice.actions;
export default reservasSlice.reducer;