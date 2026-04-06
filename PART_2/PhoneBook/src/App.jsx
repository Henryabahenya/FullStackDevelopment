import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    console.log('Name input:', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('Number input:', event.target.value)
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const nameExists = persons.some(person => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    console.log('Adding new entry:', personObject)

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
    
    console.log('Update complete. Current list length:', persons.length + 1)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => 
          <div key={person.name}>
            {person.name} {person.number}
          </div>
        )}
      </div>
    </div>
  )
}

export default App