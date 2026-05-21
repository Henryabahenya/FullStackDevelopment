const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('blog api tests', () => {
  // Reset the test database before running each test case
  beforeEach(async () => {
    await Blog.deleteMany({})
    
    // Insert our initial test blogs array
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('blogs are returned as json and correct amount exists', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Assert that the array length matches our initial dataset length (2)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

// Clean up database connection after all tests finish
after(async () => {
  await mongoose.connection.close()
})