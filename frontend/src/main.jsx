import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SearchProvider } from './context/SearchContext';

import { useContext } from 'react';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchProvider>
    <App />
    </SearchProvider>
  </StrictMode>,
)
