import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import salonReducer from './features/salones/salonSlice'; // <-- 1. Importar

export const store = configureStore({
  reducer: {
    auth: authReducer,
    salones: salonReducer, // <-- 2. Añadir el nuevo reducer
  },
});