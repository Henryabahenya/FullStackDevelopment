export const getAnecdotes = () =>
  fetch('http://localhost:3001/anecdotes')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    })

export const createNewAnecdote = (newAnecdote) =>
  fetch('http://localhost:3001/anecdotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to create new anecdote')
      }
      return res.json()
    })

export const updateAnecdote = (updatedAnecdote) =>
  fetch(`http://localhost:3001/anecdotes/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to update anecdote votes')
      }
      return res.json()
    })
