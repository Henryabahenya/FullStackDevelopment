const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user"); // Import the User model
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// ... keep your GET route here ...
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 }) // Explicitly include id

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }

  // Look how clean! The old getTokenFrom line is completely gone.
  // We extract the token directly from the request object populated by the middleware.
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0, // Defaults to 0 if missing
    user: user.id
  })

  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Correct DELETE path: Only /:id
blogsRouter.delete('/:id', async (request, response) => {
  // 1. Verify the incoming token from our middleware
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // 2. Find the blog post to check ownership
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // 3. Compare the creator's ID with the token user's ID
  // We use .toString() as instructed because blog.user is a Mongoose ObjectId object
  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ 
      error: 'permission denied: only the creator can delete this blog' 
    })
  }

  // 4. Authorized: Safe to delete
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
// Correct PUT path: Only /:id

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blogUpdateData = { title, author, url, likes, user }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blogUpdateData, { new: true, runValidators: true })
    .populate('user', { username: 1, name: 1, id: 1 })

  if (updatedBlog && user) {
    // Automatically find the referenced user and append this blog ID if it isn't there already
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

// ... keep your DELETE and PUT routes here ...

module.exports = blogsRouter;
