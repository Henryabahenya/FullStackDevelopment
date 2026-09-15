import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <nav className="app-nav">
      <Link className="app-nav-link" to="/">
        BLOGS
      </Link>
      <Link className="app-nav-link" to="/users">
        USERS
      </Link>
      <Link className="app-nav-link" to="/create">
        NEW BLOG
      </Link>
      <Link className="app-nav-link" to="/login">
        LOGOUT
      </Link>
    </nav>
  )
}

export default Menu
