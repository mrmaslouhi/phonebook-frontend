import { useState, useEffect } from 'react'
import { Filter, PersonForm, Persons } from './components/Components'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [nameToFilter, setNameToFilter] = useState("")
  const [addMessage, setAddMessage] = useState(null)
  const [messageType, setMessageType] = useState("")

  const addData = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)
      && persons.some(person => person.number === newNumber)) {
      alert(`${newName} is already added to phonebook.`)
      setNewName("")
      setNewNumber("")
      return
    }
    else if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const thisPerson = persons.find(person => person.name === newName)
        personService
          .update(thisPerson.id, { ...thisPerson, number: newNumber })
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name === returnedPerson.name ? returnedPerson : person))
          })
          .catch(error => {
            setAddMessage(`Information of ${thisPerson.name} has already been removed from server`)
            setMessageType("error")
            setTimeout(() => {
              setAddMessage(null)
              setMessageType(null)
            }, 5000)
          })
        setNewName("")
        setNewNumber("")
      }
    }
    else {
      const newPersonsObj = { name: newName, number: newNumber }
      personService
        .create(newPersonsObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error => {
          setAddMessage(error.response.data.error)
          setMessageType("error")
        })
      setAddMessage(`Added ${newName}`)
      setTimeout(() => {
        setAddMessage(null)
        setMessageType(null)
      }, 5000)
      setNewName("")
      setNewNumber("")
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameToFilter(event.target.value)
  }

  const personFormProps = {
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange,
    addData
  }

  const deletePerson = id => {
    const thisPerson = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${thisPerson.name} ?`)) {
      personService.deleteResource(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage} type={messageType} />
      <Filter nameToFilter={nameToFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm data={personFormProps} />
      <h2>Numbers</h2>
      <Persons persons={persons} nameToFilter={nameToFilter} deletePerson={deletePerson} />
    </div>
  )
}

export default App
