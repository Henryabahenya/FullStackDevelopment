import { useNotificationStore } from '../stores/notificationStore'

const Notification = () => {
  const { message, type } = useNotificationStore((state) => ({
    message: state.message,
    type: state.type,
  }))

  if (!message) {
    return null
  }

  return <div className={`notification ${type}`}>{message}</div>
}

export default Notification
