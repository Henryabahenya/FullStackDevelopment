import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../services/blogService'
import { useShowNotification } from '../contexts/NotificationContext'

const Blog = ({ blog }) => {
  const queryClient = useQueryClient()
  const showNotification = useShowNotification()

  const likeMutation = useMutation({
    mutationFn: (updatedBlog) =>
      blogService.update(updatedBlog.id, updatedBlog),
    onSuccess: (savedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(
        `blog '${savedBlog.title || savedBlog.content}' liked!`,
        'success',
        5
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification('blog deleted successfully', 'success', 5)
    },
  })

  const handleLike = () => {
    likeMutation.mutate({ ...blog, likes: (blog.likes || 0) + 1 })
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Remove blog '${blog.title || blog.content}' by ${blog.author}?`
      )
    ) {
      deleteMutation.mutate(blog.id)
    }
  }

  return (
    <li>
      <strong>{blog.title || blog.content}</strong> by {blog.author}
      <div>
        likes {blog.likes || 0}{' '}
        <button type="button" onClick={handleLike}>
          like
        </button>
      </div>
      <button type="button" onClick={handleDelete}>
        delete
      </button>
    </li>
  )
}

export default Blog
