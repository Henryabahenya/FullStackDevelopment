import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useUserDispatch } from '../contexts/UserContext'
import { saveUser } from '../services/persistentUser'
import loginService from '../services/loginService'
import blogService from '../services/blogService'
import { useShowNotification } from '../contexts/NotificationContext'

const LoginForm = () => {
  const { reset: resetUsername, ...usernameProps } = useField('text')
  const { reset: resetPassword, ...passwordProps } = useField('password')
  const dispatch = useUserDispatch()
  const showNotification = useShowNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username: usernameProps.value,
        password: passwordProps.value,
      })
      saveUser(user)
      blogService.setToken(user.token)
      dispatch({ type: 'SET_USER', payload: user })
      showNotification('logged in', 'success', 5)
      resetUsername()
      resetPassword()
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
          <input name="Username" {...usernameProps} />
        </div>
        <div>
          password
          <input name="Password" {...passwordProps} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
