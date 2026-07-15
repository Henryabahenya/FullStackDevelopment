import { create } from 'zustand'
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
  likeBlog: async (id) => {
    const blog = (await blogService.getAll()).find((b) => b.id === id)
    if (!blog) throw new Error('Blog not found')
    const updated = { ...blog, likes: (blog.likes || 0) + 1 }
    const saved = await blogService.update(id, updated)
    set((state) => ({
      blogs: state.blogs.map((b) => (b.id === id ? saved : b)),
    }))
    return saved
  },
  deleteBlog: async (id) => {
    await blogService.remove(id)
    set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }))
  },
}))
