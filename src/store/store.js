import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import salonReducer from './features/salones/salonSlice';
import favoritosReducer from './features/favoritos/favoritosSlice'; // 👈 1. Importar

export const store = configureStore({
  reducer: {
    auth: authReducer,
    salones: salonReducer,
    favoritos: favoritosReducer, // 👈 2. Añadir
  },
});