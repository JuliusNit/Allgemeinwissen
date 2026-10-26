import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { startPen } from './lib/pen'
import { NATIVE, startNative } from './lib/native'
import { startReminders } from './lib/reminder'

// Scrollposition setzt die App selbst (Home: aktuelle Station bzw. Kasten nach Tag 90); nach dem Neuladen
// stellte der Browser sonst die alte Position wieder her, nachdem Home schon nach oben gescrollt hatte
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

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
