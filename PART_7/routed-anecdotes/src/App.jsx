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
import { useBlogStore } from './stores/blogStore'

const App = () => {
  const blogs = useBlogStore((state) => state.blogs)
  const initializeBlogs = useBlogStore((state) => state.initializeBlogs)

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<AnecdoteList anecdotes={blogs} />} />
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
