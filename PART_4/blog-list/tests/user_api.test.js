const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose') // CRUCIAL: Missing import fixed
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    
    await User.deleteMany({})
    

    await User.syncIndexes()

    const newUser = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash: 'hashedpasswordxyz',
    })

    await newUser.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})
    
    const newUser = {
      username: 'Bama',
      name: 'Bama Elanga',
      password: 'supersecretpassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with status code 400 if username is already taken', async () => {
    const duplicateUser = {
      username: 'root',
      name: 'Another Root',
      password: 'validPassword123',
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'expected `username` to be unique')
  })

  test('creation fails with status code 400 if password is less than 3 characters long', async () => {
    const invalidUser = {
      username: 'validUsername',
      name: 'Short Password Test',
      password: '12', 
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'password must be at least 3 characters long')
  })

  test('creation fails with status code 400 if username is less than 3 characters long', async () => {
    const invalidUser = {
      username: 'ed', 
      name: 'Short Username Test',
      password: 'validPassword123',
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'username must be at least 3 characters long')
  })

  
  after(async () => {
    await mongoose.connection.close()
  })
})