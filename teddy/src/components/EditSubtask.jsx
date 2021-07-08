import { useState } from 'react'

const EditSubtask = ({ onEdit, subtask }) => {
    const [name, setName] = useState(subtask.name)
    const [minutes, setMinutes] = useState(subtask.minutes)
    const oldMinutes = subtask.minutes

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }
        
        let id = subtask.id
        onEdit( {id, name, minutes}, oldMinutes )

        setName('')
        setMinutes(0)
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Subtask Name</label>
                <input type='text' placeholder='Add Subtask Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className = 'form-control'>
                <label>Subtask Time (Minutes)</label>
                <input type='number' placeholder='Add Subtask Time Estimate in Minutes' value={minutes} onChange={(e) => setMinutes(e.target.value)}/>
            </div>

            <input type='submit' value='Save Subtask' className='btn btn-block'/>
        </form>
    )
}

export default EditSubtask