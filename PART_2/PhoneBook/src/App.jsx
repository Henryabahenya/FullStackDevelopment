import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, type }) => (
  message === null 
    ? null 
    : <div className={type}>{message}</div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    console.log('Fetching initial data...')
    personService.getAll().then(initialPersons => {
      console.log('Data loaded successfully')
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    existingPerson
      ? window.confirm(`${newName} is already added, replace the old number?`)
        ? personService
            .update(existingPerson.id, { ...existingPerson, number: newNumber })
            .then(returnedPerson => {
              console.log('Update successful')
              setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
              setMessageType('success')
              setMessage(`Updated ${returnedPerson.name}`)
              setTimeout(() => setMessage(null), 5000)
              setNewName('')
              setNewNumber('')
            })
            .catch(error => {
              console.log('Error: Person already deleted from server')
              setMessageType('error')
              setMessage(`Information of ${newName} has already been removed from server`)
              setPersons(persons.filter(p => p.id !== existingPerson.id))
              setTimeout(() => setMessage(null), 5000)
            })
        : console.log('Update canceled by user')
      : personService
          .create({ name: newName, number: newNumber })
          .then(returnedPerson => {
            console.log('Created new entry')
            setPersons(persons.concat(returnedPerson))
            setMessageType('success')
            setMessage(`Added ${returnedPerson.name}`)
            setTimeout(() => setMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
  }

  const deletePerson = (id, name) => {
    window.confirm(`Delete ${name}?`)
      ? personService.remove(id)
          .then(() => {
            console.log('Deletion successful')
            setPersons(persons.filter(p => p.id !== id))
            setMessageType('success')
            setMessage(`Deleted ${name}`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            console.log('Error: Could not delete, resource missing')
            setMessageType('error')
            setMessage(`Information of ${name} was already removed from server`)
            setPersons(persons.filter(p => p.id !== id))
            setTimeout(() => setMessage(null), 5000)
          })
      : console.log('Deletion canceled')
  }

  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />

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