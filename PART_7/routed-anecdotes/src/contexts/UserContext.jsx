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
  const [user, dispatch] = useReducer(userReducer, {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    token: 'bearer mock-testing-token-12345',
  })

  console.log('DEV BYPASS ACTIVE: Automatically logged in as Matti Luukkainen')

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
