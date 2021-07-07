import React from 'react'
import Task from './Task'

function Tasks({tasks, onDelete, onEdit}){
    return (
        <ul className='tasks'>
            {
            tasks.map((task) => 
            <Task key={task.id} task={task} onDelete={onDelete} onEdit={onEdit}/>
            )}
        </ul>
    )
}

export default Tasks
