import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'
import { useShowNotification } from '../contexts/NotificationContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginUser = useUserStore((s) => s.loginUser)
  const showNotification = useShowNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await loginUser({ username, password })
      showNotification('logged in', 'success', 5)
      navigate('/')
    } catch (err) {
      showNotification(err.message || 'Login failed', 'error', 5)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
