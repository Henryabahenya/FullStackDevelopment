import { createContext, useContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserValue must be used inside UserContextProvider')
  }
  return context[0]
}

export const useUserDispatch = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserDispatch must be used inside UserContextProvider')
  }
  return context[1]
}
