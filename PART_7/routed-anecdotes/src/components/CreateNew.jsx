import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'
import { useNotificationStore } from '../stores/notificationStore'

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const setNotification = useNotificationStore((state) => state.setNotification)
  const { reset: resetContent, ...contentProps } = useField('text')
  const { reset: resetAuthor, ...authorProps } = useField('text')
  const { reset: resetInfo, ...infoProps } = useField('text')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    addAnecdote({
      content: contentProps.value,
      author: authorProps.value,
      info: infoProps.value,
      votes: 0,
    }).then((savedAnecdote) => {
      setNotification(
        `a new anecdote '${savedAnecdote.content}' created!`,
        'success',
        5
      )
      navigate('/')
    })
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name="content" {...contentProps} />
        </div>
        <div>
          author
          <input name="author" {...authorProps} />
        </div>
        <div>
          url for more info
          <input name="info" {...infoProps} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew
