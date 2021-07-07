import { useState } from 'react'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddTask = ({ onAdd }) => {
    const [name, setName] = useState('')
    const [dueDate, setDueDate] = useState(new Date())

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

        onAdd( {name, dueDate} )

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

export default AddTask