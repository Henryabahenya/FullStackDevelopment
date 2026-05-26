// controllers/users.js
const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

// 1. GET request to fetch all users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// 2. POST request to create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // For 4.15, we'll keep it basic. (Validation constraints come in 4.16!)
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter