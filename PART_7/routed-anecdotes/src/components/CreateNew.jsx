import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogService'
import { useShowNotification } from '../contexts/NotificationContext'

const CreateNew = () => {
  const showNotification = useShowNotification()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const createMutation = useMutation({
    mutationFn: (newBlog) => blogService.create(newBlog),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(`a new blog '${saved.content}' created!`, 'success', 5)
      navigate('/')
    },
  })
  const { reset: resetContent, ...contentProps } = useField('text')
  const { reset: resetAuthor, ...authorProps } = useField('text')
  const { reset: resetInfo, ...infoProps } = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({
      content: contentProps.value,
      author: authorProps.value,
      info: infoProps.value,
      likes: 0,
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
