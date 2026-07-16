const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra }
  if (token) headers.Authorization = token
  return headers
}

const getAll = async () => {
  const mockBlogs = [
    {
      id: '69ca37149a4f210017fca12b',
      title: 'The Single Responsibility Principle',
      author: 'Robert C. Martin',
      url: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleResponsibilityPrinciple.html',
      likes: 5,
      user: { name: 'Matti Luukkainen', username: 'mluukkai' },
      comments: [
        'a must read',
        'a true classic',
        'has this still meaning in the LLM era?',
      ],
    },
    {
      id: '5a28c4b9d4e2f301b2a3c4d5',
      title: 'Goto considered harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 12,
      user: { name: 'Matti Luukkainen', username: 'mluukkai' },
      comments: ['groundbreaking paper'],
    },
    {
      id: '7b1f9e8a2c6d4a5b9e3f2c1a',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      url: 'https://www.oreilly.com/library/view/clean-code-a/9780136083238/',
      likes: 8,
      user: { name: 'Outi Savolainen', username: 'ousavola' },
      comments: ['Essential reading', 'Changed my coding style'],
    },
  ]

  return mockBlogs
}

const create = async (blogObject) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: getHeaders(),
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
    headers: getHeaders(),
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
    headers: token ? { Authorization: token } : {},
  })
  if (!response.ok) {
    throw new Error('Failed to delete blog')
  }
  return response.json()
}

const createComment = async (id, comment) => {
  try {
    const response = await fetch(`${baseUrl}/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ comment }),
    })
    if (!response.ok) {
      throw new Error('Failed to add comment')
    }
    return response.json()
  } catch (error) {
    console.error('Comment submission error:', error)
    // For mock data, just return success
    return { success: true }
  }
}

export default { getAll, create, update, remove, setToken, createComment }
