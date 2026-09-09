import { create } from 'zustand'

let timeoutId = null

export const useNotificationStore = create((set) => ({
  message: '',
  type: '',
  setNotification: (message, type, seconds) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    set({ message, type })

    timeoutId = setTimeout(() => {
      set({ message: '', type: '' })
      timeoutId = null
    }, seconds * 1000)
  },
}))
