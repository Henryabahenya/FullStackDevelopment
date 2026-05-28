const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user"); // Import the User model

// ... keep your GET route here ...
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 }) // Explicitly include id

  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).end();
  }

  // Find any arbitrary user from your database
  const user = await User.findOne({});

  if (!user) {
    return response
      .status(400)
      .json({ error: "No users found in database to assign as creator" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id, // Save the creator's ID in the blog document
  });

  const savedBlog = await blog.save();

  // Append the newly created blog's ID to the user's internal list of blogs
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

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
