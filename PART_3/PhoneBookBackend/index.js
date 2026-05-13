require('dotenv').config() 
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') 

const app = express()


app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()
    res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
    `)
  })
})


app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error)) 
})


app.post('/api/persons', (req, res) => {
  const body = req.body 

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }


  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})



const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})