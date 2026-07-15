import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { NotificationContextProvider } from './contexts/NotificationContext'

createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
)
