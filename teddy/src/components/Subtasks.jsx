import React from 'react'
import Subtask from './Subtask'

function Subtasks({subtasks, onDelete, onEdit}){
    return (
        <ul className='subtasks'>
            {
            subtasks.map((subtask) => 
            <Subtask key={subtask.id} subtask={subtask} onDelete={onDelete} onEdit={onEdit}/>
            )}
        </ul>
    )
}

export default Subtasks