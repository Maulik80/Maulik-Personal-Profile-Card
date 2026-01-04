import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Import Router
import { AppContextProvider } from './context/AppContext.jsx'; // Import Context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* 1. Wrap with Router */}
      <AppContextProvider> {/* 2. Wrap with Context */}
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)