const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user"); // Import the User model

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


const jwt = require('jsonwebtoken') // Import jwt at the top

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }

  // Extract the raw token string from the request headers
  const token = getTokenFrom(request)
  
  // Decode and verify the signature using our environmental secret
  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  // If the token is missing or invalid, jwt.verify throws an error handled by our middleware,
  // but we explicitly check for the ID property here to be safe
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // Find the exact user bound to the token payload
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// Correct DELETE path: Only /:id
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

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
