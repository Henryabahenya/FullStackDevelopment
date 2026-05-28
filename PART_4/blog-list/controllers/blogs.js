const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require('../utils/middleware'); // Used to pull userExtractor

// --- GET ROUTE ---
// Remains wide open to the public; no token or user extractor required.
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
})

// --- POST ROUTE ---
// Chained with middleware.userExtractor to capture request.user automatically
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }

  // Look how clean! The middleware already found and attached our full user document
  const user = request.user

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id // Safe reference to the user ID
  })

  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// --- DELETE ROUTE ---
// Chained with middleware.userExtractor to guard the resource against non-creators
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user // Populated automatically via the middleware chain

  // 1. Find the target blog post to check ownership
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // 2. Compare the creator's ID with our verified request user ID
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ 
      error: 'permission denied: only the creator can delete this blog' 
    })
  }

  // 3. Authorized: Safe to delete
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// --- PUT ROUTE ---
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blogUpdateData = { title, author, url, likes, user }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blogUpdateData, { new: true, runValidators: true })
    .populate('user', { username: 1, name: 1, id: 1 })

  if (updatedBlog && user) {
    const userToUpdate = await User.findById(user)
    if (userToUpdate && !userToUpdate.blogs.includes(updatedBlog._id)) {
      userToUpdate.blogs = userToUpdate.blogs.concat(updatedBlog._id)
      await userToUpdate.save()
    }
    response.json(updatedBlog)
  } else if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter;