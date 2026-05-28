// controllers/users.js
const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// 1. GET request to fetch all users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 }) // Explicitly include id

  response.json(users)
})

// 2. POST request to create a new user (Updated for 4.16 validations)
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Check 1: Ensure both username and password exist
  if (!username || !password) {
    return response.status(400).json({
      error: "both username and password are required",
    });
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: "username must be at least 3 characters long",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
