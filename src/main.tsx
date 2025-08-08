import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ThemeProvider } from './components/theme-provider'
createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="drum-studio-theme">
    <App />
  </ThemeProvider>
);
