import { useState } from 'react';
import { useJsApiLoader } from "@react-google-maps/api";
import { Route, Routes } from "react-router-dom";
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
import Searchbar from './Components/SearchBar/searchbar';
import ItemSalonDetallado from './Components/Item-salon-detallado/ItemSalonDetallado';

function App() {
  const [count, setCount] = useState(0);
   const salon = salonesData[0];
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA6qkN_GTx9fEu53hl2OzwLFqZnq116BF8",
    libraries: ["places"],
    id: "google-map-script",
  });
  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<><Navbar user={null} /><HomeScreen/> <Footer/></>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />

        <Route path="/publicar" element={<> <NuevoSalonScreen isLoaded={isLoaded}/> </>} />

        <Route path="/terminos&condiciones" element={<><Navbar user={null} /> <TerminosYCondicionesScreen/><Footer/> </>} />
        <Route path="/mis-salones" element={<> <Navbar user={null}/> <MisSalonesScreen/> <Footer/> </>}/>
        <Route path="/mis_ventas" element={<><Navbar user={null} /><Reservacionesrec/><Footer/></>}></Route>

      </Routes>
    </div>
  );
}


export default App;