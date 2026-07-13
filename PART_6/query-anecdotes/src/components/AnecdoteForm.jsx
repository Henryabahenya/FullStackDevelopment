import { useCreateAnecdoteMutation } from '../hooks/useAnecdoteQueries'
import { useNotificationDispatch } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdoteMutation()
  const dispatch = useNotificationDispatch()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          dispatch({ type: 'SET_NOTIFICATION', payload: `anecdote '${content}' created` })
          setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
        },
        onError: (error) => {
          // Display the server validation error text ("too short anecdote...")
          dispatch({ type: 'SET_NOTIFICATION', payload: error.message })
          setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000)
        }
      }
    )
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
