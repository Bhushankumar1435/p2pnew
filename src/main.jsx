import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import './index.css'

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    // <React.StrictMode> 
      <AuthProvider>
        <BrowserRouter> 
        
            <App /> 
        </BrowserRouter>
      </AuthProvider> 
    // </React.StrictMode>
  );
} else {
  console.error('❌ Root element with id="root" not found');
}