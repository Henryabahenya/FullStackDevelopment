// 1. MAKE SURE THESE TWO LINES ARE EXACTLY AS SHOWN
const { test, describe, beforeEach, before, after } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('blog api tests', () => {
  
  before(async () => {
    await mongoose.connection.asPromise()
  })

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

  test('blogs have a unique identifier property named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]

    assert.ok(firstBlog.id)
    assert.strictEqual(firstBlog._id, undefined)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Async/Await simplifies asynchronous code',
      author: 'Henry Abahenya',
      url: 'https://fullstackopen.com/',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Async/Await simplifies asynchronous code'))
  })

  test('if the likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Understanding Default Values in Mongoose',
      author: 'Henry Abahenya',
      url: 'https://fullstackopen.com/'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})