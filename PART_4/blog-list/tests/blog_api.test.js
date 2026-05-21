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

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Async/Await simplifies asynchronous code',
    author: 'Henry Abahenya',
    url: 'https://fullstackopen.com/',
    likes: 12
  }

  // 1. Make the POST request using supertest
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // 2. Fetch all blogs from the DB using our helper utility
  const blogsAtEnd = await helper.blogsInDb()
  
  // 3. Verify total count increased by 1
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  // 4. Verify the title of the saved blog exists in the database
  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes('Async/Await simplifies asynchronous code'))
})

after(async () => {
  await mongoose.connection.close()
})