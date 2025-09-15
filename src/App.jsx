import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ paddingTop: "80px", "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       
      <Routes>
        <Route path="/" element={<> <Navbar user={null} /> <HomeScreen/> </>} />
      </Routes>
    </div>
  )
}

export default App
