import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

// URL BASE DE TU BACKEND (Ajusta si es diferente, ej: localhost:3000)
const API_URL = 'http://localhost:3000/chat'; 

// --- HELPER PARA HEADERS CON TOKEN ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- THUNKS (ACCIONES ASÍNCRONAS) ---

// 1. Obtener todas mis conversaciones (GET /chat/conversaciones)
export const obtenerConversaciones = createAsyncThunk(
  'chat/obtenerConversaciones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/conversaciones`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Error al cargar chats');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Iniciar o recuperar chat con publicante (POST /chat/conversacion)
export const iniciarConversacion = createAsyncThunk(
  'chat/iniciar',
  async ({ publicanteId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/conversacion`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ usuario_destino_id: publicanteId }), // DTO esperado
      });
      if (!response.ok) throw new Error('Error al iniciar conversación');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Enviar mensaje (POST /chat/mensaje)
export const enviarMensaje = createAsyncThunk(
  'chat/enviarMensaje',
  async ({ conversacionId, contenido }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/mensaje`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ conversacion_id: conversacionId, contenido }), // DTO esperado
      });
      if (!response.ok) throw new Error('Error al enviar mensaje');
      return await response.json();
    } catch (error) {
      console.log(error.message);
      
      return rejectWithValue(error.message);
    }
  }
);

// 4. Obtener mensajes de un chat específico (GET /chat/mensajes?conversacionId=X)
// Esto es útil para actualizar el chat al abrirlo
export const obtenerMensajesDelChat = createAsyncThunk(
  'chat/obtenerMensajes',
  async (conversacionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/mensajes?conversacionId=${conversacionId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Error al obtener historial');
      return { conversacionId, mensajes: await response.json() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,
    activeChat: null,
    conversaciones: [], // Ya no usamos mocks
    loading: false,
    error: null,
  },
  reducers: {
    toggleSidebar: (state, action) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },
    cerrarChatActivo: (state) => {
      state.activeChat = null;
    },
    abrirChatEspecifico: (state, action) => {
      state.activeChat = action.payload;
      state.isOpen = true;
    },
    // Acción opcional para recibir mensajes en tiempo real (Sockets) en el futuro
    recibirMensajeEnVivo: (state, action) => {
        const mensaje = action.payload;
        // Si el chat está abierto, lo agregamos
        if (state.activeChat && state.activeChat.id === mensaje.conversacion_id) {
            state.activeChat.mensajes.push(mensaje);
        }
        // También actualizamos la lista general si es necesario
        // ... lógica para actualizar preview en lista ...
    },
    agregarMensajeEnVivo: (state, action) => {
        const nuevoMensaje = action.payload;
        
        // 1. Si tengo el chat abierto y es el mismo ID, lo agrego a la vista
        if (state.activeChat && state.activeChat.id === nuevoMensaje.conversacion_id) {
          state.activeChat.mensajes.push(nuevoMensaje);
        }
  
        // 2. Actualizo la lista de conversaciones (para que se vea el último mensaje en el sidebar)
        const chatEnLista = state.conversaciones.find(c => c.id === nuevoMensaje.conversacion_id);
        if (chatEnLista) {
          if (!chatEnLista.mensajes) chatEnLista.mensajes = [];
          chatEnLista.mensajes.push(nuevoMensaje);
          // Opcional: Mover este chat al principio de la lista (tipo WhatsApp)
          state.conversaciones = [
              chatEnLista, 
              ...state.conversaciones.filter(c => c.id !== nuevoMensaje.conversacion_id)
          ];
        }
      }
  },
  extraReducers: (builder) => {
    builder
      // OBTENER CONVERSACIONES
      .addCase(obtenerConversaciones.pending, (state) => { state.loading = true; })
      .addCase(obtenerConversaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.conversaciones = action.payload;
      })
      
      // INICIAR CONVERSACION
      .addCase(iniciarConversacion.fulfilled, (state, action) => {
        const chat = action.payload;
        state.activeChat = chat;
        state.isOpen = true;
        // Si no existe en la lista, lo agregamos
        if (!state.conversaciones.find(c => c.id === chat.id)) {
            state.conversaciones.push(chat);
        }
      })

      // ENVIAR MENSAJE
      .addCase(enviarMensaje.fulfilled, (state, action) => {
        // Agregamos el mensaje retornado por el server al chat activo
        if (state.activeChat) {
             // Aseguramos que el array mensajes exista
             if(!state.activeChat.mensajes) state.activeChat.mensajes = [];
             state.activeChat.mensajes.push(action.payload);
        }
      })

      // OBTENER MENSAJES (HISTORIAL)
      .addCase(obtenerMensajesDelChat.fulfilled, (state, action) => {
         if (state.activeChat && state.activeChat.id === action.payload.conversacionId) {
             state.activeChat.mensajes = action.payload.mensajes;
         }
      });
  }
});

export const { toggleSidebar, agregarMensajeEnVivo, cerrarChatActivo, abrirChatEspecifico, recibirMensajeEnVivo } = chatSlice.actions;
export default chatSlice.reducer;