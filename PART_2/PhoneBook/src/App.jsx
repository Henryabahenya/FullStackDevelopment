import { useState, useEffect } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
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
              setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
              setNewName('')
              setNewNumber('')
            })
        : console.log('Update canceled')
      : personService
          .create({ name: newName, number: newNumber })
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
          })
  }

  const deletePerson = (id, name) => {
    window.confirm(`Delete ${name}?`)
      ? personService.remove(id).then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
      : console.log('Delete canceled')
  }

  const personsToShow = persons.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
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