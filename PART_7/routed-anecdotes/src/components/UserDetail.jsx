import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/userService'

const UserDetail = () => {
  const { id } = useParams()
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ['users'], queryFn: userService.getAll })

  if (isLoading) return <div>loading user…</div>
  if (isError) return <div>failed to load user</div>

  const user = users.find((u) => u.id === id)
  if (!user) return <div>User not found</div>

  return (
    <div className="users-page">
      <h2 className="page-title">{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map((blog, index) => (
            <li key={blog.id ?? `${id}-${index}`}>
              {blog.title || 'Untitled blog'}
            </li>
          ))
        ) : (
          <li>No blogs added</li>
        )}
      </ul>
    </div>
  )
}

export default UserDetail
