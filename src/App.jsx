import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
// import Navbar from './components/Navbar/Navbar';
import LoginScreen from './screens/LoginScreen';
// import Registrar from './components/Registrar/Registrar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
      <Routes>
        <Route path="/" element={<> <HomeScreen/> </>} />
        <Route path="/login" element={<> <LoginScreen/> </>} />
      </Routes>
    </div>
  )
}

export default App

{/* <Navbar/> */}
{/* <Rergistrar/> */}