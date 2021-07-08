import { useState } from 'react'

const AddSubtask = ({ onAdd }) => {
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

export default AddSubtask