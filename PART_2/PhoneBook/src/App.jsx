import { useState } from 'react'

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    console.log('Typing:', event.target.value)
    setNewName(event.target.value)
  }

 
  const addPerson = (event) => {
    event.preventDefault() 
    console.log('Button clicked, adding:', newName)

    const nameObject = {
      name: newName
    }

  
    setPersons(persons.concat(nameObject))
    setNewName('')
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
      <ul>
      
        {persons.map(person => 
          <li key={person.name}>{person.name}</li>
        )}
      </ul>
    </div>
  )
}

export default App