import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';


import LoginScreen from './screens/LoginScreen';
// import Registrar from './components/Registrar/Registrar'

import Footer from './components/Footer/Footer';

import RegistroScreen from "./screens/RegistroScreen";
import Reservacionesrec from './Components/reservaciones_recibidas/reservacionesrec';
import Searchbar from './Components/SearchBar/searchbar';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<><Navbar user={null} /><HomeScreen/><Footer/></>} />
        <Route path="/searchbar" element={<><Navbar user={null} /><Footer/></>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />
        <Route path="/mis_ventas" element={<><Navbar user={null} /><Reservacionesrec/><Footer/></>}></Route>
      </Routes>
    </div>
  );
}


export default App;