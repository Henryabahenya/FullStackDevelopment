import { useCreateAnecdoteMutation } from '../hooks/useAnecdoteQueries'
import { useNotify } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdoteMutation()
  const notify = useNotify()

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          notify(`anecdote '${content}' created`)
        },
        onError: (error) => {
          notify(error.message)
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
