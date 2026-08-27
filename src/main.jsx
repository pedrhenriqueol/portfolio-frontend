import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { FontProvider } from './context/FontContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <FontProvider>
          <App />
        </FontProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>,
)

