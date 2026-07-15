import create from 'zustand'
import blogService from '../services/blogService'

export const useBlogStore = create((set) => ({
  blogs: [],
  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  createBlog: async (blogObject) => {
    const createdBlog = await blogService.create(blogObject)
    set((state) => ({ blogs: state.blogs.concat(createdBlog) }))
    return createdBlog
  },
}))
