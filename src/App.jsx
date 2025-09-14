import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import Navbar from './Components/Navbar';
<title>Focus Room</title>
function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ paddingTop: "80px", "--primary-color": "#6A0DAD", "--second-color": "#7B2FF7", "--background-color": "#f3f3fe" }}>
       <Navbar user={null} />
      <Routes>
        <Route path="/" element={<> <HomeScreen/> </>} />
      </Routes>
    </div>
  )
}

export default App
