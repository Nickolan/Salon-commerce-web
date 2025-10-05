import { useState } from 'react';
import { useJsApiLoader } from "@react-google-maps/api";
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
// import Registrar from './components/Registrar/Registrar'
import LoginScreen from './screens/LoginScreen';
import EditarPerfil from './screens/EditarPerfil';
import Perfil from './screens/Perfil';
// import Registrar from './components/Registrar/Registrar'
import Footer from './components/Footer/Footer';
import RegistroScreen from "./screens/RegistroScreen";
import NuevoSalonScreen from './screens/NuevoSalonScreen';
import TerminosYCondicionesScreen from './screens/TerminosYCondicionesScreen';
import Reservacionesrec from './Components/reservaciones_recibidas/reservacionesrec';
import MisSalonesScreen from './screens/MisSalonesScreen';
import DetallesSalon from './screens/DetallesSalon';
import MisReservas from './screens/MisReservas';
import Chatbot from './Components/ChatBot/Chatbot';
import ReservasDetalles from './screens/ReservasDetalles';

function App() {
  const [count, setCount] = useState(0);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA6qkN_GTx9fEu53hl2OzwLFqZnq116BF8",
    libraries: ["places"],
    id: "google-map-script",
  });

  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<><Navbar user={null} /><HomeScreen/> <Chatbot/> <Footer/></>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />

        <Route path="/publicar" element={<><NuevoSalonScreen isLoaded={isLoaded}/><Chatbot/></>} />

        <Route path="/terminos&condiciones" element={<><Navbar user={null} /> <TerminosYCondicionesScreen/> <Chatbot/><Footer/></>} />
        <Route path="/mis-salones" element={<> <Navbar user={null}/> <MisSalonesScreen/> <Chatbot/> <Footer/> </>}/>
        <Route path="/mis_ventas" element={<><Navbar user={null}/><Reservacionesrec/> <Chatbot/><Footer/></>}/>
        <Route path="/perfil" element={<><Navbar user={null}/><Perfil/><Footer/> <Chatbot/></>}/>
        <Route path='/editar-perfil' element={<><Navbar user={null}/><EditarPerfil/> <Chatbot/><Footer/></>}/>
        <Route path="/salon_detalles" element={<><Navbar user={null} /> <DetallesSalon/> <Chatbot/><Footer/></>} />
        <Route path="/mis-reservas" element={<> <Navbar user={null}/> <MisReservas/> <Chatbot/> <Footer/> </>}/>
        <Route path="/reservas_detalles" element={<><Navbar user={null}/> <ReservasDetalles /> <Chatbot/> <Footer/> </>} />
      </Routes>
    </div>
  );
}


export default App;