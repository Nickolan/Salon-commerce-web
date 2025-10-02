import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
import LoginScreen from './screens/LoginScreen';
import MisSalonesScreen from './screens/MisSalonesScreen'
import salonesData from './utils/Salones.json'
import Footer from './components/Footer/Footer';

import RegistroScreen from "./screens/RegistroScreen";
import Reservacionesrec from './Components/reservaciones_recibidas/reservacionesrec';
import Searchbar from './Components/SearchBar/searchbar';
import ItemSalonDetallado from './Components/Item-salon-detallado/ItemSalonDetallado';

function App() {
  const [count, setCount] = useState(0);
   const salon = salonesData[0];
  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<><Navbar user={null} /><HomeScreen/> <Footer/></>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />
        <Route path="/mis-salones" element={<> <Navbar user={null}/> <MisSalonesScreen/> <Footer/> </>}/>

        <Route path="/mis_ventas" element={<><Navbar user={null} /><Reservacionesrec/><Footer/></>}></Route>
      </Routes>
    </div>
  );
}


export default App;