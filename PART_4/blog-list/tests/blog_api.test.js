const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('blog api tests', () => {
 
  beforeEach(async () => {
    await Blog.deleteMany({})
    
    
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

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

test('blogs have a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')


  const firstBlog = response.body[0]

  assert.ok(firstBlog.id)
  

  assert.strictEqual(firstBlog._id, undefined)
})

after(async () => {
  await mongoose.connection.close()
})