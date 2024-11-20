export const Filter = ({ nameToFilter, handleFilterChange }) => {
    return (
        <>
            <label>filter shown with</label>
            <input value={nameToFilter} onChange={handleFilterChange} />
        </>
    )
}

export const PersonForm = ({ data }) => {
    return (
        <form onSubmit={data.addData} >
            <div>
                name: <input required value={data.newName} onChange={data.handleNameChange} />
                number: <input required value={data.newNumber} onChange={data.handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export const Persons = ({ persons, nameToFilter, deletePerson }) => {
    return (
        <>
            {nameToFilter === "" ?
                persons.map(person => (
                    <p key={person.name}>
                        {person.name} {person.number}
                        <button onClick={() => deletePerson(person.id)}>delete</button>
                    </p>
                )) :
                persons.map(person => person.name.toLowerCase().includes(nameToFilter.toLowerCase()) ? <p key={person.name}>{person.name} {person.number}</p> : "")
            }
        </>
    )
}
