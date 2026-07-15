import create from 'zustand'
import loginService from '../services/loginService'
import blogService from '../services/blogService'

const LOCAL_KEY = 'loggedBlogAppUser'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loginUser: async (credentials) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
    blogService.setToken(user.token)
    set({ user })
    return user
  },
  logoutUser: () => {
    window.localStorage.removeItem(LOCAL_KEY)
    blogService.setToken(null)
    set({ user: null })
  },
  initializeUser: () => {
    const logged = window.localStorage.getItem(LOCAL_KEY)
    if (logged) {
      try {
        const user = JSON.parse(logged)
        blogService.setToken(user.token)
        set({ user })
      } catch (e) {
        console.error('Failed to parse stored user', e)
      }
    }
  },
}))
