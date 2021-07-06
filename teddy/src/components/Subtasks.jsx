import React from 'react'
import Subtask from './Subtask'

function Subtasks({subtasks, onDelete}){
    return (
        <ul className='subtasks'>
            {
            subtasks.map((subtask) => 
            <Subtask key={subtask.id} subtask={subtask} onDelete={onDelete}/>
            )}
        </ul>
    )
}

export default Subtasks