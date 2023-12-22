import { useState, useEffect } from 'react';
import './index.css'
import Form from './components/Form';
import Notification from './components/Notification';
import personService from './services/persons'

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>Delete</button>
    </li>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('a new name...')
  const [newNumber, setNewNumber] = useState('a new number...')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    console.log('Name changed:', event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log('Number changed:', event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log('Filter changed:', event.target.value)
    setNewFilter(event.target.value)
  }

  useEffect(() => {
    personService
    .getAll()
    .then(initialNotes => {
      setPersons(initialNotes)
    })
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const findPerson = persons.find(n => n.name === newName)
    if (findPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        console.log('Päivitetään')
        const changedPerson = { ...findPerson, number: newNumber }
        personService
        .update(findPerson.id, changedPerson)
        .then(() => {
          personService.getAll().then((updatedPersons) => {
            setPersons(updatedPersons);
          });
          setSuccessMessage(`${newName}'s number was successfully updated.`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
          setNewName('')
          setNewNumber('')
          setNewFilter('')
          return
        })
        .catch(error => {
          console.error('Error:', error);
          return
        });
      }
    } else {
      personService
      .create(personObject)
      .then(() => {
        personService.getAll().then((updatedPersons) => {
          setPersons(updatedPersons);
        });
        console.log('Uusi luotu')
        setSuccessMessage(`${newName } successfully added to the phonebook.`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setNewName('')
        setNewNumber('')
        setNewFilter('')
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage(`${newName } has already been removed from the phonebook.`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    }
  }

    const deletePerson = id => {
      if (window.confirm(`Confirm the removal`)) {
        personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
          setSuccessMessage(`Contact successfully removed from the phonebook.`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting person:', error)
          setErrorMessage('Error while deleting a person from the phonebook');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
        }
  };

    return (
      <div>
        <div><h2>Phonebook</h2></div>
        <Notification message={successMessage} type="success" />
        <Notification message={errorMessage} type="error" />
      <div></div>
        <div>
          <Form 
          newName={newName} 
          newNumber={newNumber} 
          newFilter={newFilter}
          handleFilterChange={handleFilterChange}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          deletePerson={() => deletePerson()}
          addPerson={addPerson} 
          />
          </div>
        <div><h2>Numbers</h2></div>
        <div><ul>
        {persons.map((person) => {
        if (!newFilter || person.name.toLowerCase().includes(newFilter.toLowerCase())) {
          return <Person key={person.name} person={person} deletePerson={() => deletePerson(person.id)} />;
        }
        return null;
      })}
        </ul></div>
      </div>
    )
  }

  export default App