import { useState } from 'react'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const EditTask = ({ onEdit, task }) => {
    const [name, setName] = useState(task.name)
    const [dueDate, setDueDate] = useState(task.dueDate)

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        if (!dueDate) {
            alert('Please add a date')
            return
        }

        let id = task.id

        onEdit( { id, name, dueDate} )

        setName('')
        setDueDate(new Date())
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Task Name</label>
                <input type='text' placeholder='Add Task Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className = 'form-control'>
                <label>Task Due Date</label>
                <DatePicker
                    showTimeSelect
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    dateFormat="MMMM d, yyyy h:mm aa"
                /> 
            </div>

            <input type='submit' value='Save Task' className='btn btn-block'/>
        </form>
    )
}

export default EditTask