const express = require('express')
const app = express()

let persons= [
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
    {"id" : "5",
    "name" : "Henry Abahenya",
    "number" : "+254768407749"
    }
]

app.get('/api/persons',(req,res) => {
    res.json(persons)
})

app.get('/info',(req,res) => {
    const count = persons.length

    const date = new Date()

    const resText= `<p>Phonebook has info ${count} people</p>
    <p> ${date}</p>`
res.send(resText)
})

app.get('/api/persons/:id',(req,res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    res.json(person)
})

app.delete('/api/persons/:id',(req,res) => {
    const id = req.params.id
    persons= persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})

