import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { startPen } from './lib/pen'
import { NATIVE, startNative } from './lib/native'
import { startReminders } from './lib/reminder'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

startPen()
if (NATIVE) {
  startNative()
  startReminders()
} else {
  registerSW({ immediate: true })
}
