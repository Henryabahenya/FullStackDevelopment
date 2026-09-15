import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import userService from '../services/userService'

const Users = () => {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (isLoading) return <div>loading users…</div>
  if (isError) return <div>failed to load users</div>

  return (
    <div className="users-page">
      <h2 className="page-title">Users</h2>
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link className="users-link" to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </td>
                <td>{user.username}</td>
                <td>{(user.blogs && user.blogs.length) || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
