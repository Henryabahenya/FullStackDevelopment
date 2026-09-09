import { create } from 'zustand'
import loginService from '../services/loginService'
import blogService from '../services/blogService'
import { getUser, saveUser, removeUser } from '../services/persistentUser'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loginUser: async (credentials) => {
    const user = await loginService.login(credentials)
    saveUser(user)
    blogService.setToken(user.token)
    set({ user })
    return user
  },
  logoutUser: () => {
    removeUser()
    blogService.setToken(null)
    set({ user: null })
  },
  initializeUser: () => {
    const logged = getUser()
    if (logged) {
      blogService.setToken(logged.token)
      set({ user: logged })
    }
  },
}))
