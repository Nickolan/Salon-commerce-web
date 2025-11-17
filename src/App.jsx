import { useEffect, useState } from 'react'; // 👈 1. Importar useEffect
import { useDispatch, useSelector } from 'react-redux'; // 👈 2. Importar hooks
import { fetchFavoritos } from './store/features/favoritos/favoritosSlice';
import { useJsApiLoader } from "@react-google-maps/api";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
import LoginScreen from './screens/LoginScreen';
import MisSalonesScreen from './screens/MisSalonesScreen'
import salonesData from './utils/Salones.json'
//import Footer from './Components/Footer/Footer';
import Footer from './Components/Footer/Footer.jsx'

import RegistroScreen from "./screens/RegistroScreen";
import NuevoSalonScreen from './screens/NuevoSalonScreen';
import TerminosYCondicionesScreen from './screens/TerminosYCondicionesScreen';
import Reservacionesrec from './Components/reservaciones_recibidas/Reservacionesrec';
import ResultadosScreen from './screens/ResultadosScreen';
import DetallesSalon from './screens/DetallesSalon';
import MisReservas from './screens/MisReservas';
import Chatbot from './Components/ChatBot/Chatbot';
import ReservarScreen from './screens/ReservarScreen';
import ResumenReservaScreen from './screens/ResumenReservaScreen'
import EditarPerfil from './screens/EditarPerfil';
import Perfil from './screens/Perfil';
import ConfirmacionReservaScreen from './screens/ConfirmacionReservaScreen';
import ReservasDetalles from './screens/ReservasDetalles';
import FavoritosScreen from './screens/FavoritosScreen';
import { revalidateSession } from './store/features/auth/authSlice';
import ReseniarScreen from './screens/ReseniarScreen';
import PoliticaPrivacidadScreen from './screens/PoliticaPrivacidadScreen'
import AdminScreen from './screens/AdminScreen';
import Cancelacion from './screens/Cancelacion';
import ReservarSalonScreen from './screens/ReservarSalonScreen';
import EditarSalonScreen from './screens/EditarSalonScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

function App() {
  const [count, setCount] = useState(0);
  const salon = salonesData[0];
  const token = localStorage.getItem('accessToken');

  const dispatch = useDispatch();
  const { isAuthenticated, user, isAdmin, status: authStatus } = useSelector((state) => state.auth);


  useEffect(() => {
    // Si el usuario está autenticado, cargamos sus favoritos.
    if (isAuthenticated) {
      dispatch(fetchFavoritos());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {

    setTimeout(() => {
      if (token && authStatus === 'idle') {
        dispatch(revalidateSession());
      }
    }, 500);



    // Si hay un token y aún no hemos intentado revalidar la sesión
  }, [dispatch, authStatus]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA6qkN_GTx9fEu53hl2OzwLFqZnq116BF8",
    libraries: ["places"],
    id: "google-map-script",
  });

  if (authStatus === 'revalidating') {
    return <div>Cargando sesión...</div>; // O un componente de Spinner más elegante
  }

  return (

    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>

      <Routes>
        <Route path="/" element={<><Navbar/><HomeScreen isLoaded={isLoaded} /> <Chatbot /> <Footer /></>} />
        <Route path="/login" element={<> <LoginScreen /> </>} />
        <Route path="/registro" element={<> <RegistroScreen /> </>} />
        <Route path="/resultados" element={<> <Navbar/> <ResultadosScreen isLoaded={isLoaded} /> <Footer /> </>} />

        <Route path="/publicar" element={<><Navbar/><NuevoSalonScreen isLoaded={isLoaded} /><Chatbot /><Footer /></>} />

        <Route path="/terminos&condiciones" element={<><Navbar/> <TerminosYCondicionesScreen /> <Chatbot /><Footer /></>} />
        <Route path="/mis-salones" element={<> <Navbar/> <MisSalonesScreen /> <Chatbot /> <Footer /> </>} />
        <Route path="/mis_ventas" element={<><Navbar/><Reservacionesrec /> <Chatbot /><Footer /></>} />
        <Route path="/perfil" element={<><Navbar/><Perfil /><Footer /> <Chatbot /></>} />
        <Route path='/editar-perfil' element={<><Navbar/><EditarPerfil isLoaded={isLoaded} /> <Chatbot /><Footer /></>} />
        {/* <Route path='/reservar/:id_salon' element={<><Navbar user={null}/><ReservarScreen/> <Chatbot/><Footer/></>}/> */}
        <Route path='/resumen-reserva/:id_salon' element={<><Navbar/><ResumenReservaScreen /><Chatbot /><Footer /></>} />
        <Route path='/confirmacion-reserva' element={<><Navbar/><ConfirmacionReservaScreen /><Chatbot /><Footer /></>} />
        <Route path="/salon/:id" element={<> <Navbar/> <DetallesSalon isLoaded={isLoaded} /> <Chatbot /> <Footer /> </>} />
        <Route path="/mis-reservas" element={<> <Navbar/> <MisReservas /> <Chatbot /> <Footer /> </>} />
        <Route path="/reservas_detalles/:id" element={<><Navbar/> <ReservasDetalles /> <Chatbot /> <Footer /> </>} />

        <Route path='/favoritos' element={<><Navbar/><FavoritosScreen /> <Chatbot /><Footer /></>} />
        <Route path="/cancelar_salon/:idUsuario/:idReserva" element={<><Navbar/><Cancelacion /><Chatbot /><Footer /></>} />

        <Route path="/reservar/:id" element={<><Navbar/><ReservarSalonScreen /><Chatbot /><Footer /></>} />

        <Route path='/reseniar/:id_salon' element={<><Navbar/><ReseniarScreen /><Chatbot /><Footer /></>} />
        <Route path="/politica-de-privacidad" element={<><Navbar/> <PoliticaPrivacidadScreen /> <Chatbot /><Footer /></>} />

        <Route
          path="/admin"
          element={isAuthenticated ? <AdminScreen /> : <Navigate to="/" />}
        />
        {/* Opcional: Rutas hijas si AdminScreen tiene sub-navegación */}
        {/* <Route path="/admin/usuarios" element={isAuthenticated && isAdmin ? <UsuariosAdmin /> : <Navigate to="/" />} /> */}
        {/* <Route path="/admin/salones" element={isAuthenticated && isAdmin ? <SalonesAdmin /> : <Navigate to="/" />} /> */}

        <Route path="/editar-salon/:id" element={<><Navbar/> <EditarSalonScreen isLoaded={isLoaded} /> <Chatbot /><Footer /> </> } />

        <Route path='forgot-password' element={<ForgotPasswordScreen/>} />
      </Routes>
    </div>
  );
}


export default App;