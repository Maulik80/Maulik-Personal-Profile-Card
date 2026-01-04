/* client/src/main.jsx */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import Router
import './index.css';
import App from './App.jsx';
import AppContextProvider from './context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 1. Wrap in Router */}
      <AppContextProvider> {/* 2. Wrap in Context */}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);