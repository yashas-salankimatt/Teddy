import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import Button from './Button'
import Subtasks from './Subtasks'
import AddSubtask from './AddSubtask'

function Task({task, onDelete}){
    const [subtasks, setSubtasks] = useState([
        {
            id: '0',
            name: 'First Subtask',
            minutes: 30
        },
        {
            id: '1',
            name: 'Second Subtask',
            minutes: 40
        },
        {
            id: '2',
            name: 'Third Subtask',
            minutes: 50
        },
    ])

    const [showAddSubtask, setShowAddSubtask] = useState(false)

    const[taskIsOpen, setTaskIsOpen] = useState(false)
    const toggleTask = () => setTaskIsOpen(!taskIsOpen)

    const addSubtask = (subtask) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newSubtask = {id, ...subtask}
        setSubtasks([...subtasks, newSubtask])
    }

    const deleteSubtask = (id) => {
        setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
    }

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
                <Button color={showAddSubtask ? 'red' : 'green'} text={showAddSubtask ? 'Close' : 'Add'} 
                    onClick={() => setShowAddSubtask(!showAddSubtask)}/>
                {showAddSubtask && <AddSubtask onAdd = {addSubtask}/>}
                <Button color={taskIsOpen ? 'red' : 'green'} text={taskIsOpen ? 'Close Subtasks' : 'Show Subtasks'} 
                    onClick={toggleTask}/>
                {
                    taskIsOpen && (subtasks.length>0 ? (<Subtasks subtasks = {subtasks} onDelete={deleteSubtask}/>) : ('No subtasks to show'))
                }

            </div>
        </li>
    )
}

export default Task
