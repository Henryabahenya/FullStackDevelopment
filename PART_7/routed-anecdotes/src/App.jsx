import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import LoginForm from './components/LoginForm'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogService'
import { useUserStore } from './stores/userStore'

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
          <li key={b.id}>
            {b.title || b.content} by {b.author}
          </li>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const initializeUser = useUserStore((state) => state.initializeUser)
  const user = useUserStore((state) => state.user)
  const logoutUser = useUserStore((state) => state.logoutUser)

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        {user && (
          <div>
            {user.name} logged in <button onClick={logoutUser}>logout</button>
          </div>
        )}
        <Notification />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogsView />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  )
}

export default App
