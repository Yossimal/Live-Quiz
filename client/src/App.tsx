import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// import { AuthProvider } from "./contexts/AuthProvider";
import Router from "./router/Router";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}
