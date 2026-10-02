import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/overpass-mono/400.css'
import '@fontsource/overpass-mono/600.css'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

// Drawings start hidden only when scripts run, so they can plot themselves
// in; without JS every drawing is simply shown finished.
document.documentElement.classList.add('js-motion')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
