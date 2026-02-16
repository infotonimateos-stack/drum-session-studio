import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ThemeProvider } from './components/theme-provider'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="drum-studio-theme">
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
