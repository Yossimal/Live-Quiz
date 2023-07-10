import { BrowserRouter, Routes, Route } from "react-router-dom"
import Singup from "./pages/Singup"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Singup />} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
