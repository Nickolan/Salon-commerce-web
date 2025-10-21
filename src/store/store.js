// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import salonReducer from './features/salones/salonSlice';
import favoritosReducer from './features/favoritos/favoritosSlice';
import reservasReducer from './features/reservas/reservasSlice'; // 👈 Importar

export const store = configureStore({
  reducer: {
    auth: authReducer,
    salones: salonReducer,
    favoritos: favoritosReducer,
    reservas: reservasReducer, // 👈 Añadir
  },
  // Deshabilitar temporalmente la verificación de serialización si da problemas con las fechas
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});