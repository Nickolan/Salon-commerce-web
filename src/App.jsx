import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
import LoginScreen from './screens/LoginScreen';
// import Registrar from './components/Registrar/Registrar'
import MisSalonesScreen from './screens/MisSalonesScreen'

import Footer from './components/Footer/Footer';

import RegistroScreen from "./screens/RegistroScreen";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<><Navbar user={null} /><HomeScreen/><Footer/></>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />
        <Route path="/mis-salones" element={<> <Navbar user={null}/> <MisSalonesScreen/> <Footer/> </>}/>
      </Routes>
    </div>
  );
}


export default App;