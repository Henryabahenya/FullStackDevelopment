import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message }) => (
  message === null 
    ? null 
    : <div className="success">{message}</div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      console.log('Initial data fetched')
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    existingPerson
      ? window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        ? personService
            .update(existingPerson.id, { ...existingPerson, number: newNumber })
            .then(returnedPerson => {
              console.log('Update successful')
              setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
              setMessage(`Updated ${returnedPerson.name}'s number`)
              setTimeout(() => setMessage(null), 5000)
              setNewName('')
              setNewNumber('')
            })
        : console.log('Update canceled')
      : personService
          .create({ name: newName, number: newNumber })
          .then(returnedPerson => {
            console.log('Creation successful')
            setPersons(persons.concat(returnedPerson))
            setMessage(`Added ${returnedPerson.name}`)
            setTimeout(() => setMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
  }

  const deletePerson = (id, name) => {
    window.confirm(`Delete ${name}?`)
      ? personService.remove(id).then(() => {
          console.log(`Deleted id: ${id}`)
          setPersons(persons.filter(p => p.id !== id))
          setMessage(`Deleted ${name}`)
          setTimeout(() => setMessage(null), 5000)
        })
      : console.log('Delete canceled')
  }

  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>

      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <div><button type="submit">add</button></div>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App