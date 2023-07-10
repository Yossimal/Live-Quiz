import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';

//theme
import "primereact/resources/themes/tailwind-light/theme.css";
//core
import "primereact/resources/primereact.min.css";

import "primeicons/primeicons.css";                 //icons
import "primeflex/primeflex.css";                   //grid

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
