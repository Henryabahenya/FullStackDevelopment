import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const { message, type } = useNotificationValue()

  if (!message) return null

  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification
