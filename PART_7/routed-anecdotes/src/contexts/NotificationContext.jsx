import React, { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const initialState = { message: '', type: '' }

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        message: action.payload.message,
        type: action.payload.type || 'success',
      }
    case 'CLEAR_NOTIFICATION':
      return { message: '', type: '' }
    default:
      return state
  }
}

let timeoutId = null

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      'useNotificationValue must be used within NotificationContextProvider'
    )
  }
  return ctx.state
}

export const useNotificationDispatch = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error(
      'useNotificationDispatch must be used within NotificationContextProvider'
    )
  }
  return ctx.dispatch
}

export const useShowNotification = () => {
  const dispatch = useNotificationDispatch()
  return (message, type = 'success', seconds = 5) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } })
    timeoutId = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
      timeoutId = null
    }, seconds * 1000)
  }
}

export default NotificationContext
