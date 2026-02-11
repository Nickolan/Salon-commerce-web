import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// URL BASE DE TU BACKEND (Ajusta si usas otro puerto)
const API_URL = 'http://localhost:3000/chat'; 

// --- HELPER PARA HEADERS CON TOKEN ---
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- THUNKS (ACCIONES ASÍNCRONAS HTTP) ---

// 1. Obtener todas mis conversaciones (GET /chat/conversaciones)
// Esto trae la lista con el campo 'unread_count' calculado por el backend
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

// 2. Iniciar o recuperar chat (POST /chat/conversacion)
// Usado por el botón "Contactar" en el perfil del salón
export const iniciarConversacion = createAsyncThunk(
  'chat/iniciar',
  async ({ publicanteId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/conversacion`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ usuario_destino_id: publicanteId }), 
      });
      if (!response.ok) throw new Error('Error al iniciar conversación');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Obtener mensajes de un chat específico (GET /chat/mensajes)
// Al llamar a esto, el backend marca los mensajes como LEÍDOS automáticamente
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

// --- SLICE (ESTADO GLOBAL) ---
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    isOpen: false,       // ¿El sidebar está visible?
    activeChat: null,    // Objeto de la conversación abierta actualmente
    conversaciones: [],  // Lista de todas las conversaciones
    loading: false,
    error: null,
  },
  reducers: {
    // Abrir/Cerrar Sidebar manualmente
    toggleSidebar: (state, action) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },

    // Cerrar la ventana de chat (volver a la lista)
    cerrarChatActivo: (state) => {
      state.activeChat = null;
    },

    // Abrir un chat específico desde la lista
    abrirChatEspecifico: (state, action) => {
      //const chatSeleccionado = action.payload;
      
      if (action.payload === null) {
        state.activeChat = null;
        return;
      }

      state.activeChat = action.payload;
      state.isOpen = true;

      // LÓGICA DE LECTURA: 
      // Al abrirlo, visualmente reseteamos el contador a 0 inmediatamente
      if (state.activeChat) {
         state.activeChat.unread_count = 0;
      }

      // También buscamos en la lista general para apagar la bolita roja
      const chatEnLista = state.conversaciones.find(c => c.id === chatSeleccionado.id);
      if (chatEnLista) {
        chatEnLista.unread_count = 0;
      }
    },

    abrirChatEspecifico: (state, action) => {
      state.activeChat = action.payload;
      state.isOpen = true;
    },

    // ACCIÓN CLAVE: Recibir mensaje en tiempo real (Socket)
    agregarMensajeEnVivo: (state, action) => {
      const nuevoMensaje = action.payload;
      
      // A. Si tengo este chat ABIERTO ahora mismo:
      if (state.activeChat && state.activeChat.id === nuevoMensaje.conversacion_id) {
        // Lo agrego a la lista de mensajes visibles
        state.activeChat.mensajes.push(nuevoMensaje);
        // NO incremento el contador (porque lo estoy viendo)
      }

      // B. Actualizar la lista lateral de conversaciones
      const index = state.conversaciones.findIndex(c => c.id === nuevoMensaje.conversacion_id);
      
      if (index !== -1) {
        const chat = state.conversaciones[index];
        
        // 1. Agrego el mensaje al array (para la preview)
        if (!chat.mensajes) chat.mensajes = [];
        chat.mensajes.push(nuevoMensaje);

        // 2. Si NO es el chat activo, incremento el contador de no leídos
        const esChatActivo = state.activeChat && state.activeChat.id === chat.id;
        if (!esChatActivo) {
             const currentCount = typeof chat.unread_count === 'number' ? chat.unread_count : 0;
             chat.unread_count = currentCount + 1;
        }

        // 3. REORDENAMIENTO: Mover este chat al inicio de la lista (UX tipo WhatsApp)
        state.conversaciones.splice(index, 1); // Lo sacamos de donde esté
        state.conversaciones.unshift(chat);    // Lo ponemos primero
      } else {
        // Opcional: Si el chat no existía (ej: es nuevo y alguien me escribió), 
        // deberíamos volver a pedir la lista completa o agregarlo manualmente.
        // Por simplicidad, aquí no hacemos nada, pero en el siguiente refresh aparecerá.
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // OBTENER LISTA DE CHATS
      .addCase(obtenerConversaciones.pending, (state) => { state.loading = true; })
      .addCase(obtenerConversaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.conversaciones = action.payload;
      })
      .addCase(obtenerConversaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // INICIAR CONVERSACIÓN
      .addCase(iniciarConversacion.fulfilled, (state, action) => {
        const chat = action.payload;
        state.activeChat = chat;
        state.isOpen = true;
        // Si no estaba en la lista, lo agregamos al principio
        if (!state.conversaciones.find(c => c.id === chat.id)) {
            state.conversaciones.unshift(chat);
        }
      })

      // OBTENER HISTORIAL (Y MARCAR LEÍDO)
      .addCase(obtenerMensajesDelChat.fulfilled, (state, action) => {
         // Solo actualizamos si seguimos viendo el mismo chat
         if (state.activeChat && state.activeChat.id === action.payload.conversacionId) {
             state.activeChat.mensajes = action.payload.mensajes;
         }
      });
  }
});

export const { 
  toggleSidebar, 
  cerrarChatActivo, 
  abrirChatEspecifico, 
  agregarMensajeEnVivo 
} = chatSlice.actions;

export default chatSlice.reducer;