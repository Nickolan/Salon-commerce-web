import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import RegistroScreen from "./screens/RegistroScreen";
import HomeScreen from "./screens/HomeScreen";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
      <Routes>
        <Route path="/" element={<> <HomeScreen/> </>} />
        <Route path="/registro" element={<> <RegistroScreen/> </>} />
      </Routes>
    </div>
  )
}

export default App
