const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // 1. Locate the user in the database
  const user = await User.findOne({ username })
  
  // 2. Check if user exists and verify password hash match
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // 3. Define the data payload to put inside the token
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // 4. Digitally sign the token using your environment secret key
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter