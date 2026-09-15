import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createNewAnecdote, updateAnecdote } from '../requests'

export const useAnecdotesQuery = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })
}

export const useCreateAnecdoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNewAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })
}

export const useVoteAnecdoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })
}
