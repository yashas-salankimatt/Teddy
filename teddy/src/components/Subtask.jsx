import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import EditSubtask from './EditSubtask'
import Button from './Button'

function Subtask({subtask, onDelete, onEdit}){

    const [showEditSubtask, setShowEditSubtask] = useState(false)

    return (
        <li className='subtask'>
            <div className='subtask'>
                <h3>
                    {subtask.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(subtask.id)}/>
                </h3>
                <p>
                    {subtask.minutes} minutes
                </p>
                <Button color={showEditSubtask ? 'red' : 'green'} text={showEditSubtask ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditSubtask(!showEditSubtask)}/>
                {showEditSubtask && <EditSubtask onEdit = {onEdit} subtask = {subtask}/>}

            </div>
        </li>
    )
}

export default Subtask