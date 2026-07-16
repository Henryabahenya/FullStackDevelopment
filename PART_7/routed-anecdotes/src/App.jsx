import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import Blog from './components/Blog'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogService'
import { getUser, removeUser } from './services/persistentUser'
import { useUserDispatch, useUserValue } from './contexts/UserContext'
import './App.css'

const BlogsView = () => {
  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ['blogs'], queryFn: blogService.getAll })

  if (isLoading) return <div>loading blogs…</div>
  if (isError) return <div>failed to load blogs</div>

  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {blogs.map((b) => (
          <Blog key={b.id} blog={b} />
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const user = useUserValue()
  const dispatch = useUserDispatch()

  useEffect(() => {
    const savedUser = getUser()
    if (savedUser) {
      blogService.setToken(savedUser.token)
      dispatch({ type: 'SET_USER', payload: savedUser })
    }
  }, [dispatch])

  const logoutUser = () => {
    removeUser()
    blogService.setToken(null)
    dispatch({ type: 'CLEAR_USER' })
  }

  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-inner">
            <div className="app-brand">Blog App</div>
            <Menu />
          </div>
        </header>

        <div className="app-container">
          {user && (
            <div className="app-userbar">
              {user.name} logged in{' '}
              <button className="app-logout-button" onClick={logoutUser}>
                logout
              </button>
            </div>
          )}

          <main className="app-main">
            <Notification />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<BlogsView />} />
                <Route path="/users" element={<Users />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/create" element={<CreateNew />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
