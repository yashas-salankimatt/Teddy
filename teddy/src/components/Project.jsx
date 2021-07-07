import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import Button from './Button'
import AddTask from './AddTask'
import Tasks from './Tasks'
import EditProject from './EditProject'
function Project({project, onDelete, onEdit}){
    const [tasks, setTasks] = useState([
        {
            id: '0',
            name: 'First Part',
            minutes: 30
        },
        {
            id: '1',
            name: 'Second Part',
            minutes: 40
        },
        {
            id: '2',
            name: 'Third Part',
            minutes: 50
        },
    ])
    

    const [showAddTask, setShowAddTask] = useState(false)

    const [showEditProject, setShowEditProject] = useState(false)

    const[projectIsOpen, setProjectIsOpen] = useState(false)
    const toggleProject = () => setProjectIsOpen(!projectIsOpen)

    const addTask = (task) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newTask = {id, ...task}
        setTasks([...tasks, newTask])
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

    const editTask = (editTask) => {   
        setTasks(tasks.map(function(task) {
            if (task.id !== editTask.id){
                return task
            } else {
                return editTask
            }
        }, this))
    }

    return (
        <li className='project'>
            <div className='project'>
                <h3>
                    {project.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(project.id)}/>
                </h3>
                <p>
                    {project.description}
                </p>
                <Button color={showAddTask ? 'red' : 'green'} text={showAddTask ? 'Close' : 'Add'} 
                    onClick={() => setShowAddTask(!showAddTask)}/>
                {showAddTask && <AddTask onAdd = {addTask}/>}

                <Button color={showEditProject ? 'red' : 'green'} text={showEditProject ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditProject(!showEditProject)}/>
                {showEditProject && <EditProject onEdit = {onEdit} project = {project}/>}

                <Button color={projectIsOpen ? 'red' : 'green'} text={projectIsOpen ? 'Close Tasks' : 'Show Tasks'} 
                    onClick={toggleProject}/>
                {
                    projectIsOpen && (tasks.length>0 ? (<Tasks tasks = {tasks} onDelete={deleteTask} onEdit={editTask}/>) : ('No tasks to show'))
                }
                

            </div>
        </li>
    )
}

export default Project
