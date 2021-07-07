import { useState } from 'react'

const EditTask = ({ onEdit, task }) => {
    const [name, setName] = useState(task.name)
    const [minutes, setMinutes] = useState(task.minutes)

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        let id = task.id

        onEdit( { id, name, minutes} )

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

export default EditTask