import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'

function Subtask({subtask, onDelete}){

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

            </div>
        </li>
    )
}

export default Subtask