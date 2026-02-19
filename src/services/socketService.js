// src/services/socketService.js
import io from 'socket.io-client';

let socket;

export const socketService = {
  connect: (token) => {
    if (!socket) {
      socket = io('http://localhost:3000', { // Asegúrate que el puerto sea el correcto
        auth: { token },
        transports: ['websocket'],
      });

      socket.on('connect', () => console.log('🟢 Conectado:', socket.id));
      socket.on('disconnect', () => console.log('🔴 Desconectado'));
      
      // Útil para debugging: ver si el servidor nos devuelve errores
      socket.on('error', (err) => console.error('🔥 Error de Socket:', err));
    }
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  // CORRECCIÓN 1: 'unirse_sala' -> 'join_room'
  joinRoom: (conversacionId) => {
    if (socket) {
      console.log('Intentando unirse a sala:', conversacionId);
      socket.emit('join_room', { conversacion_id: conversacionId });
    }
  },

  // CORRECCIÓN 2: 'enviar_mensaje' -> 'send_message'
  sendMessage: (payload) => {
    if (socket) {
      console.log('Enviando mensaje:', payload);
      socket.emit('send_message', payload);
    }
  },

  on: (eventName, callback) => {
    if (socket) socket.on(eventName, callback);
  },

  off: (eventName) => {
    if (socket) socket.off(eventName);
  }
};