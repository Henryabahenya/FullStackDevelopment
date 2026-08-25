import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <li>
      <Link className="blog-link" to={`/blogs/${blog.id}`}>
        {blog.title || blog.content} by {blog.author}
      </Link>
    </li>
  )
}

export default Blog
