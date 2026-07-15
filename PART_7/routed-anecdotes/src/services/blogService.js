const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch blogs')
  }
  return response.json()
}

const create = async (blogObject) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogObject),
  })
  if (!response.ok) {
    throw new Error('Failed to create blog')
  }
  return response.json()
}

const update = async (id, updatedObject) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedObject),
  })
  if (!response.ok) {
    throw new Error('Failed to update blog')
  }
  return response.json()
}

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete blog')
  }
  return response.json()
}
export default { getAll, create, update, remove }
