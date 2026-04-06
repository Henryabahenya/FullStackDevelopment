import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    console.log('Input value:', event.target.value)
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    console.log('Checking for duplicate:', newName)

    const nameExists = persons.some(person => person.name === newName)
    console.log('Does name exist?', nameExists)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      console.log('Action blocked: Duplicate found')
      return
    }

    const personObject = {
      name: newName
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    
    console.log('Person added successfully')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => 
          <div key={person.name}>{person.name}</div>
        )}
      </div>
    </div>
  )
}

export default App