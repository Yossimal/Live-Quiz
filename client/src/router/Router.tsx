import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Singup from "../pages/Signup/Singup";
import VarifyEmail from "../pages/VarifyEmail/VarifyEmail";
import Home from "../pages/Home/Home";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Singup />} />
      <Route path="/varifyEmail/:token" element={<VarifyEmail />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
