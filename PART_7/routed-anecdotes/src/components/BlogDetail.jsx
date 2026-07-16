import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from '../services/blogService'

const BlogDetail = () => {
  const { id } = useParams()
  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ['blogs'], queryFn: blogService.getAll })

  if (isLoading) return <div>loading blog…</div>
  if (isError) return <div>failed to load blog</div>

  const blog = blogs.find((b) => b.id === id)
  if (!blog) return <div>blog not found</div>

  const authorName = blog.user?.name || blog.user || 'Unknown'

  return (
    <div className="blog-detail-card">
      <h2 className="blog-detail-title">{blog.title || 'Untitled blog'}</h2>
      <div className="blog-detail-author">
        by {blog.author || 'Unknown author'}
      </div>
      <a
        className="blog-detail-url"
        href={blog.url}
        target="_blank"
        rel="noreferrer"
      >
        {blog.url}
      </a>
      <div className="blog-detail-added">Added by {authorName}</div>
      <div className="blog-detail-likes-row">
        <span className="blog-likes-text">{blog.likes || 0} likes</span>
        <button type="button" className="blog-like-button">
          LIKE
        </button>
      </div>

      <div className="blog-detail-comments">
        <h3 className="comments-heading">comments</h3>
        <ul className="comments-list">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => (
              <li key={`${id}-comment-${index}`}>{comment}</li>
            ))
          ) : (
            <li>No comments yet</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogDetail
