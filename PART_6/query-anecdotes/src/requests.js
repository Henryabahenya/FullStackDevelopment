export const getAnecdotes = () =>
  fetch('http://localhost:3001/anecdotes')
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok')
      }
      return res.json()
    })
