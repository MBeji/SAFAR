import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import TestThemeToggleApp from './TestThemeToggleApp.tsx'
import TestAppleHealthApp from './TestAppleHealthApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestAppleHealthApp />
  </StrictMode>,
)
