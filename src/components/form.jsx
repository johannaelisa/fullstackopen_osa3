import React from 'react';

const Form = ({ addPerson, handleFilterChange, handleNameChange, handleNumberChange, newName, newNumber, newFilter }) => {
  return (
    <div>
    <form onSubmit={addPerson}>
        <div>filter shown with<input value={newFilter} onChange={handleFilterChange}/></div>
        <div><h2>add a new</h2></div>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
    </form>
    </div>
  );
}

export default Form