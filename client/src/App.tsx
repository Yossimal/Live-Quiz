import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./contexts/AuthProvider";
import Login from "./pages/Login/Login";
import Singup from "./pages/Signup/Singup";
import VarifyEmail from "./pages/VarifyEmail/VarifyEmail";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Singup />} />
            <Route path="/varifyEmail/:token" element={<VarifyEmail />} />
            <Route path="/about" element={<h1>About</h1>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
