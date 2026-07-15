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

export default { getAll, create }
