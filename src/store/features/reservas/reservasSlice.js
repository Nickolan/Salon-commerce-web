import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/reservas';
const FRANJAS_API_URL = 'http://localhost:3000/franjas-horarias';
const CANCELACIONES_API_URL = 'http://localhost:3000/cancelaciones';
const API_URL_TRANSACCIONES = 'http://localhost:3000/transacciones';

export const fetchAdminReservasByMonth = createAsyncThunk(
  'reservas/fetchAdminReservasByMonth',
  async (month, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Get token from auth state
      if (!token) {
        return rejectWithValue('No autenticado.'); // Reject if no token
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Add auth header
        params: { month } // Add month as query parameter (e.g., ?month=2025-10)
      };
      // Make GET request to the admin endpoint for reservations
      // Adjust '/admin' path if your backend uses a different route
      const response = await axios.get(`${API_URL}/admin`, config);
      return response.data; // Return the array of reservations
    } catch (error) {
      // Handle errors and return a specific message
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas admin.');
    }
  }
);

// --- THUNK PARA OBTENER TRANSACCIONES ADMIN POR MES ---
export const fetchAdminTransaccionesByMonth = createAsyncThunk(
  'reservas/fetchAdminTransaccionesByMonth', // Note: Still part of 'reservas' slice for simplicity, adjust if needed
  async (month, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth; // Get token from auth state
      if (!token) {
        return rejectWithValue('No autenticado.'); // Reject if no token
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Add auth header
        params: { month } // Add month as query parameter
      };
      // Make GET request to the admin endpoint for transactions
      // Adjust '/admin' path if your backend uses a different route
      const response = await axios.get(`${API_URL_TRANSACCIONES}/admin`, config);
      return response.data; // Return the array of transactions
    } catch (error) {
      // Handle errors and return a specific message
      return rejectWithValue(error.response?.data?.message || 'Error al cargar transacciones admin.');
    }
  }
);

export const cancelarReserva = createAsyncThunk(
  'reservas/cancelarReserva',
  async ({ id_reserva, motivo }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { id_reserva, motivo };

      // Llamamos al endpoint de CANCELACIONES, no de reservas
      const response = await axios.post(CANCELACIONES_API_URL, payload, config);

      // Devolvemos la reserva actualizada (que viene dentro del objeto cancelación)
      return response.data.reserva;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cancelar la reserva.');
    }
  }
);

export const generarLinkDePago = createAsyncThunk(
  'reservas/generarLinkDePago',
  async (datosParaPago, { getState, rejectWithValue }) => {
    // datosParaPago = { id_salon, fecha_reserva, hora_inicio, hora_fin, metodoPago, id_arrendatario, total }
    try {
      console.log("Datos para pago: ", datosParaPago);

      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Llamamos a un NUEVO endpoint del backend que crearemos
      // Nota: No llamamos a /api/reservas, sino a un endpoint de pago
      const response = await axios.post('http://localhost:3000/pagos/crear-checkout', // <-- NUEVO ENDPOINT
        datosParaPago,
        config
      );

      // El backend nos devolverá la URL de pago de MercadoPago/Coinbase
      return response.data; // Ej: { urlPago: "https://..." }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al generar el link de pago.');
    }
  }
);

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
  async ({ id_salon, fecha_reserva, hora_inicio, hora_fin, id_arrendatario, totalPagarCrypto, selectedCryptoCode }, { getState, rejectWithValue }) => {
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

      console.log("Reserva creada");

      console.log(response.data);

      const reserva = response.data

      // Crear transaccion completa
      const transaccionDTO = {
        id_reserva: reserva.id_reserva,
        monto_pagado: totalPagarCrypto,
        metodo_pago: selectedCryptoCode,
        estado_transaccion: reserva.estado_reserva == "creada" ? "aprobado" : "rechazado"
      }

      console.log(transaccionDTO);

      console.log("Creando transaccion");

      await axios.post(API_URL_TRANSACCIONES, transaccionDTO )

      console.log("transaccion creada");

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

export const updateReservaStatus = createAsyncThunk(
  'reservas/updateReservaStatus',
  async ({ id_reserva, estado_reserva }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { estado_reserva }; // Send only the new status

      // Call the PATCH endpoint
      const response = await axios.patch(`${API_URL}/${id_reserva}/estado`, payload, config);
      return response.data; // Return the updated reservation object
    } catch (error) {
      console.error("Error updating reserva status:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || `Error al actualizar estado a ${estado_reserva}.`);
    }
  }
);

export const confirmarRechazarReserva = createAsyncThunk(
  'reservas/confirmarRechazarReserva',
  async ({ idReserva, nuevoEstado }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        return rejectWithValue('Usuario no autenticado.');
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { estado_reserva: nuevoEstado };

      // Llamada al nuevo endpoint del backend
      const response = await axios.patch(`${API_URL}/${idReserva}/decision-propietario`, payload, config); // Usa PATCH

      return response.data; // Devuelve la reserva actualizada por el backend
    } catch (error) {
      console.error("Error al actualizar estado (thunk):", error.response?.data);
      return rejectWithValue(error.response?.data?.message || `Error al ${nuevoEstado === 'confirmada' ? 'confirmar' : 'rechazar'} la reserva.`);
    }
  }
);


const initialState = {
  availableSlots: [],
  selectedSlots: [],
  misReservas: [],
  selectedReserva: null,
  reservaStatus: 'idle',
  slotsStatus: 'idle',
  misReservasStatus: 'idle',
  selectedReservaStatus: 'idle',
  error: null,
  reservasRecibidas: [],
  reservasRecibidasStatus: 'idle',
  pagoStatus: 'idle', // <-- NUEVO: Estado para el link de pago
  pagoError: null,
  adminReservas: [], // <-- NUEVO: Para reservas del admin
  adminReservasStatus: 'idle', // <-- NUEVO
  adminReservasError: null, // <-- NUEVO
  adminTransacciones: [], // <-- NUEVO: Para transacciones del admin
  adminTransaccionesStatus: 'idle', // <-- NUEVO
  adminTransaccionesError: null,
  updateStatus: 'idle', // Add specific status for update operations
  updateError: null,
};

const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    selectSlots: (state, action) => {
      state.selectedSlots = action.payload;
    },
    clearSelectedSlots: (state) => {
      state.selectedSlots = [];
    },
    resetReservaStatus: (state) => { // Ensure this resets update status too
      state.reservaStatus = 'idle';
      state.pagoStatus = 'idle';
      state.updateStatus = 'idle'; // Reset update status
      state.error = null;
      state.pagoError = null;
      state.updateError = null; // Reset update error
    },
    clearSelectedReserva: (state) => { // Ensure this resets update status too
      state.selectedReserva = null;
      state.selectedReservaStatus = 'idle';
      state.updateStatus = 'idle'; // Reset on clearing
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.slotsStatus = 'loading';
        state.selectedSlots = []; // 👈 CAMBIO: Limpiar selección
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
        state.selectedSlots = []; // 👈 CAMBIO
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
      })
      .addCase(generarLinkDePago.pending, (state) => {
        state.pagoStatus = 'loading'; // Usamos el nuevo estado
        state.pagoError = null;
      })
      .addCase(generarLinkDePago.fulfilled, (state) => {
        state.pagoStatus = 'succeeded';
        state.selectedSlots = []; // 👈 CAMBIO
      })
      .addCase(generarLinkDePago.rejected, (state, action) => {
        state.pagoStatus = 'failed';
        state.pagoError = action.payload;
      })
      .addCase(cancelarReserva.pending, (state) => {
        state.reservaStatus = 'loading';
        state.error = null;
      })
      .addCase(cancelarReserva.fulfilled, (state, action) => {
        state.reservaStatus = 'succeeded';
        const reservaActualizada = action.payload;

        // Actualizamos la reserva en la lista 'misReservas'
        const index = state.misReservas.findIndex(
          (r) => r.id_reserva === reservaActualizada.id_reserva
        );
        if (index !== -1) {
          // Reemplazamos la reserva vieja por la actualizada
          state.misReservas[index] = reservaActualizada;
        }

        // Si la reserva cancelada era la que estaba seleccionada, la actualizamos
        if (state.selectedReserva?.id_reserva === reservaActualizada.id_reserva) {
          state.selectedReserva = reservaActualizada;
        }
      })
      .addCase(cancelarReserva.rejected, (state, action) => {
        state.reservaStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAdminReservasByMonth.pending, (state) => {
        state.adminReservasStatus = 'loading';
      })
      .addCase(fetchAdminReservasByMonth.fulfilled, (state, action) => {
        state.adminReservasStatus = 'succeeded';
        state.adminReservas = action.payload;
        state.adminReservasError = null;
      })
      .addCase(fetchAdminReservasByMonth.rejected, (state, action) => {
        state.adminReservasStatus = 'failed';
        state.adminReservasError = action.payload;
      })

      // --- CASOS PARA fetchAdminTransaccionesByMonth ---
      .addCase(fetchAdminTransaccionesByMonth.pending, (state) => {
        state.adminTransaccionesStatus = 'loading';
      })
      .addCase(fetchAdminTransaccionesByMonth.fulfilled, (state, action) => {
        state.adminTransaccionesStatus = 'succeeded';
        state.adminTransacciones = action.payload;
        state.adminTransaccionesError = null;
      })
      .addCase(fetchAdminTransaccionesByMonth.rejected, (state, action) => {
        state.adminTransaccionesStatus = 'failed';
        state.adminTransaccionesError = action.payload;
      })
      .addCase(updateReservaStatus.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateReservaStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const updatedReserva = action.payload;
        // Update the selectedReserva if it matches
        if (state.selectedReserva?.id_reserva === updatedReserva.id_reserva) {
          state.selectedReserva = updatedReserva;
        }
        // Update in misReservas list if present
        const indexMis = state.misReservas.findIndex(r => r.id_reserva === updatedReserva.id_reserva);
        if (indexMis !== -1) {
          state.misReservas[indexMis] = updatedReserva;
        }
        // Update in reservasRecibidas list if present
        const indexRec = state.reservasRecibidas.findIndex(r => r.id_reserva === updatedReserva.id_reserva);
        if (indexRec !== -1) {
          state.reservasRecibidas[indexRec] = updatedReserva;
        }
      })
      .addCase(updateReservaStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })
      .addCase(confirmarRechazarReserva.pending, (state) => {
        // Opcional: podrías usar un estado específico como 'updatingStatus'
        state.reservasRecibidasStatus = 'loading'; // Reutilizamos el status
        state.error = null;
      })
      .addCase(confirmarRechazarReserva.fulfilled, (state, action) => {
        state.reservasRecibidasStatus = 'succeeded';
        const reservaActualizada = action.payload;
        // Buscar y reemplazar en la lista de reservas recibidas
        const index = state.reservasRecibidas.findIndex(
          (r) => r.id_reserva === reservaActualizada.id_reserva
        );
        if (index !== -1) {
          state.reservasRecibidas[index] = reservaActualizada;
        }
        state.error = null;
      })
      .addCase(confirmarRechazarReserva.rejected, (state, action) => {
        state.reservasRecibidasStatus = 'failed';
        state.error = action.payload; // Guardamos el error específico
      });
  },
});

export const { selectSlots, clearSelectedSlots, resetReservaStatus, clearSelectedReserva } = reservasSlice.actions;
export default reservasSlice.reducer;