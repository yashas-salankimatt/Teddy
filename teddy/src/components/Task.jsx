import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'

function Task({task, onDelete}){

    return (
        <li className='task'>
            <div className='task'>
                <h3>
                    {task.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(task.id)}/>
                </h3>
                <p>
                    {task.minutes} minutes
                </p>

            </div>
        </li>
    )
}

export default Task
