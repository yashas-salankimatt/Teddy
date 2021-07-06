import { useState } from 'react'

const AddTask = ({ onAdd }) => {
    const [name, setName] = useState('')
    const [minutes, setMinutes] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        onAdd( {name, minutes} )

        setName('')
        setMinutes('')
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Task Name</label>
                <input type='text' placeholder='Add Task Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className = 'form-control'>
                <label>Task Time</label>
                <input type='text' placeholder='Add Task Time Estimate in Minutes' value={minutes} onChange={(e) => setMinutes(e.target.value)}/>
            </div>

            <input type='submit' value='Save Task' className='btn btn-block'/>
        </form>
    )
}

export default AddTask