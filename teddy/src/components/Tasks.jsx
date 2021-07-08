import React from 'react'
import Task from './Task'

function Tasks({tasks, onDelete, onEdit, updateMinutes}){
    return (
        <ul>
            {
            tasks.map((task) => 
            <Task key={task.id} task={task} onDelete={onDelete} onEdit={onEdit} updateMinutes={updateMinutes}/>
            )}
        </ul>
    )
}

export default Tasks
