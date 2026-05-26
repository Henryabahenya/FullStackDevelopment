const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware') // Import your new middleware

logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected securely to MongoDB Atlas')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json()) 

// Routers
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// Global Catch-All Middlewares (Must be listed AFTER your routes)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app