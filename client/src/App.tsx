import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from 'react-query/devtools'
import Router from "./router/Router";
import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";                 //icons
import "primeflex/primeflex.css";                   //grid
const queryClient = new QueryClient();

export default function App() {


  return (
    <QueryClientProvider client={queryClient}>

      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
