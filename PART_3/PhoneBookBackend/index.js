const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())


morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": "5",
      "name": "Henry Abahenya",
      "number": "+254768407749"
    }
]


app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()
    const resText = `
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
    `
    res.send(resText)
})


app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).json({ error: 'person not found' })
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body 


    if (!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number is missing' 
        })
    }


    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
   
        id: String(Math.floor(Math.random() * 1000000)),
    }

    persons = persons.concat(person)
    res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})