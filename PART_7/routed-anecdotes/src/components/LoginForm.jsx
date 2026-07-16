import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserDispatch } from '../contexts/UserContext'
import loginService from '../services/loginService'
import blogService from '../services/blogService'
import { useShowNotification } from '../contexts/NotificationContext'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useUserDispatch()
  const showNotification = useShowNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch({ type: 'SET_USER', payload: user })
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
