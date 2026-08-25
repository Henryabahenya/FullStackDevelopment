const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  let token // Variable to store our active test token

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // 1. Create a baseline test user in the test database
    const testUser = new User({
      username: 'test_admin',
      name: 'Test Admin',
      passwordHash: 'hashed_password_placeholder'
    })
    await testUser.save()

    // 2. Generate a valid token for this test user
    const jwt = require('jsonwebtoken')
    token = jwt.sign(
      { username: testUser.username, id: testUser._id }, 
      process.env.SECRET
    )

    // 3. Seed initial blogs linked to this user
    const initialBlogs = [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        user: testUser._id
      }
    ]
    await Blog.insertMany(initialBlogs)
  })

  test('a valid blog can be added with a valid token', async () => {
    const newBlog = {
      title: 'Testing Token Protected Routes',
      author: 'Henry Abahenya',
      url: 'https://fullstackopen.com/en/part4/token_authentication',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 2)
    
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Testing Token Protected Routes'))
  })

  test('blog creation fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog Post',
      author: 'Anonymous',
      url: 'https://unauthorized.com',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 1)
  })

  // --- MOVED INSIDE THE DESCRIBE BLOCK ---
  test('a blog can be deleted by its creator', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToCancel = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToCancel.id}`)
      .set('Authorization', `Bearer ${token}`) // Now correctly has access to token!
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToCancel.title))
  })

  test('deleting a blog fails with status code 403 if attempted by a non-creator user', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToCancel = blogsAtStart[0]

    const maliciousUser = new User({
      username: 'imposter',
      name: 'Imposter Dev',
      passwordHash: 'wrong_hash'
    })
    await maliciousUser.save()

    const jwt = require('jsonwebtoken')
    const imposterToken = jwt.sign(
      { username: maliciousUser.username, id: maliciousUser._id },
      process.env.SECRET
    )

    await api
      .delete(`/api/blogs/${blogToCancel.id}`)
      .set('Authorization', `Bearer ${imposterToken}`)
      .expect(403)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
  

}) 

after(async () => {
  await mongoose.connection.close()
})