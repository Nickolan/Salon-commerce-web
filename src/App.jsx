import { useEffect, useState } from 'react'; // 👈 1. Importar useEffect
import { useDispatch, useSelector } from 'react-redux'; // 👈 2. Importar hooks
import { fetchFavoritos } from './store/features/favoritos/favoritosSlice';
import { useJsApiLoader } from "@react-google-maps/api";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
import LoginScreen from './screens/LoginScreen';
import MisSalonesScreen from './screens/MisSalonesScreen'
import salonesData from './utils/Salones.json'
import Footer from './components/Footer/Footer';

import RegistroScreen from "./screens/RegistroScreen";
import NuevoSalonScreen from './screens/NuevoSalonScreen';
import TerminosYCondicionesScreen from './screens/TerminosYCondicionesScreen';
import Reservacionesrec from './Components/reservaciones_recibidas/reservacionesrec';
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

function App() {
  const [count, setCount] = useState(0);
  const salon = salonesData[0];
  const token = localStorage.getItem('accessToken');

  const dispatch = useDispatch();
  const { isAuthenticated, status: authStatus } = useSelector((state) => state.auth);

  
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
        <Route path="/" element={<><Navbar user={null} /><HomeScreen isLoaded={isLoaded} /> <Footer /></>} />
        <Route path="/login" element={<> <LoginScreen /> </>} />
        <Route path="/registro" element={<> <RegistroScreen /> </>} />
        <Route path="/resultados" element={<> <Navbar user={null} /> <ResultadosScreen isLoaded={isLoaded} /> <Footer /> </>} />

        <Route path="/publicar" element={<><NuevoSalonScreen isLoaded={isLoaded} /><Chatbot /></>} />

        <Route path="/terminos&condiciones" element={<><Navbar user={null} /> <TerminosYCondicionesScreen/> <Chatbot/><Footer/></>} />
        <Route path="/mis-salones" element={<> <Navbar user={null}/> <MisSalonesScreen/> <Chatbot/> <Footer/> </>}/>
        <Route path="/mis_ventas" element={<><Navbar user={null}/><Reservacionesrec/> <Chatbot/><Footer/></>}/>
        <Route path="/perfil" element={<><Navbar user={null}/><Perfil/><Footer/> <Chatbot/></>}/>
        <Route path='/editar-perfil' element={<><Navbar user={null}/><EditarPerfil/> <Chatbot/><Footer/></>}/>
        {/* <Route path='/reservar/:id_salon' element={<><Navbar user={null}/><ReservarScreen/> <Chatbot/><Footer/></>}/> */}
        <Route path='/resumen-reserva/:id_salon' element={<><Navbar user={null}/><ResumenReservaScreen/><Chatbot/><Footer/></>}/>
        <Route path='/confirmacion-reserva' element={<><Navbar user={null}/><ConfirmacionReservaScreen/><Chatbot/><Footer/></>} />
        <Route path="/salon/:id" element={ <> <Navbar user={null} /> <DetallesSalon isLoaded={isLoaded} /> <Chatbot/> <Footer/> </> } />
        <Route path="/mis-reservas" element={<> <Navbar user={null}/> <MisReservas/> <Chatbot/> <Footer/> </>}/>
        <Route path="/reservas_detalles/:id" element={<><Navbar user={null}/> <ReservasDetalles /> <Chatbot/> <Footer/> </>} />
          
        <Route path='/favoritos' element={<><Navbar user={null}/><FavoritosScreen/> <Chatbot/><Footer/></>}/>
        <Route path="/cancelar_salon/:idUsuario/:idReserva" element={<><Navbar user={null}/><Cancelacion /><Chatbot/><Footer/></>}/>

        <Route path="/reservar/:id" element={<><Navbar user={null} /><ReservarSalonScreen /><Chatbot/><Footer /></>} />

        <Route path='/reseniar/:id_salon' element={<><Navbar user={null}/><ReseniarScreen/><Chatbot/><Footer/></>}/>
        <Route path="/politica-de-privacidad" element={<><Navbar user={null} /> <PoliticaPrivacidadScreen/> <Chatbot/><Footer/></>} />

        <Route path='/administrador' element={<><Navbar user={null}/><AdminScreen/> <Chatbot/><Footer/></>}/>

      </Routes>
    </div>
  );
}


export default App;