import { useState, useEffect } from 'react'
import personService from './services/persons' // Import the service

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    console.log('effect triggered')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, []) 

  const addPerson = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber
    }

    console.log('sending post request via service...')
    personService
      .create(personObject)
      .then(returnedPerson => {
        console.log('server response received', returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} /></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.id}>{person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )
}

export default App