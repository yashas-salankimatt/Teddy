import React from 'react'
import Task from './Task'

function Tasks({tasks, onDelete}){
    return (
        <ul className='tasks'>
            {
            tasks.map((task) => 
            <Task key={task.id} task={task} onDelete={onDelete}/>
            )}
        </ul>
    )
}

export default Tasks
