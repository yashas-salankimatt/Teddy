import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import Button from './Button'
import Subtasks from './Subtasks'
import AddSubtask from './AddSubtask'
import EditTask from './EditTask'
import moment from 'moment';

function Task({task, onDelete, onEdit, updateMinutes}){
    const [subtasks, setSubtasks] = useState([])

    const [showAddSubtask, setShowAddSubtask] = useState(false)

    const [showEditTask, setShowEditTask] = useState(false)

    const[taskIsOpen, setTaskIsOpen] = useState(false)
    const toggleTask = () => setTaskIsOpen(!taskIsOpen)

    const [taskDone, setTaskDone] = useState({ labelChecked: false });
    const labelRef = React.createRef();

    const handleCheck = e => {
        if (taskDone.labelChecked === false) {
          labelRef.current.style.textDecoration = "line-through";
        } else {
          labelRef.current.style.textDecoration = "none";
        }
        setTaskDone({ labelChecked: !taskDone.labelChecked });
    }

    const addSubtask = (subtask) => {
        console.log(task.id)
        let id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newSubtask = {id, ...subtask}
        setSubtasks([...subtasks, newSubtask])
        id = task.id
        let name = task.name
        let dueDate = task.dueDate
        let minutes = +task.minutes + +subtask.minutes
        const newTask = {id, name, dueDate, minutes}
        updateMinutes(newTask)
    }

    const deleteSubtask = (id) => {
        let name = task.name
        let dueDate = task.dueDate
        let minutes = +task.minutes - subtasks.find(subtask => subtask.id === id).minutes
        setSubtasks(subtasks.filter((subtask) => subtask.id !== id))
        id = task.id
        const newTask = {id, name, dueDate, minutes}
        updateMinutes(newTask)
    }

    const editSubtask = (editSubtask, oldMinutes) => {   
        setSubtasks(subtasks.map(function(subtask) {
            if (subtask.id !== editSubtask.id){
                return subtask
            } else {
                let id = task.id
                let name = task.name
                let dueDate = task.dueDate
                let minutes = +(task.minutes - oldMinutes) + +editSubtask.minutes
                const newTask = {id, name, dueDate, minutes}
                updateMinutes(newTask)
                return editSubtask
            }
        }, this))
    }

    return (
        <li>
            <div className='task'>
                <h3 ref={labelRef}>
                    <input type='checkbox' onClick={handleCheck}/>
                    {task.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(task.id)}/>
                </h3>
                <p>
                    {moment(task.dueDate).format('MMMM d, yyyy - h:mm a')}
                </p>
                <p>
                    Total Task Time: {task.minutes} minutes
                </p>
                <Button color={showAddSubtask ? 'red' : 'green'} text={showAddSubtask ? 'Close' : 'Add Subtask'} 
                    onClick={() => setShowAddSubtask(!showAddSubtask)}/>
                {showAddSubtask && <AddSubtask onAdd = {addSubtask}/>}

                <Button color={showEditTask ? 'red' : 'green'} text={showEditTask ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditTask(!showEditTask)}/>
                {showEditTask && <EditTask onEdit = {onEdit} task = {task}/>}

                <Button color={taskIsOpen ? 'red' : 'green'} text={taskIsOpen ? 'Close Subtasks' : 'Show Subtasks'} 
                    onClick={toggleTask}/>
                {
                    taskIsOpen && (subtasks.length>0 ? (<Subtasks subtasks = {subtasks} onDelete={deleteSubtask} onEdit={editSubtask}/>) : ('No subtasks to show'))
                }

            </div>
        </li>
    )
}

export default Task
