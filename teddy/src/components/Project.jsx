import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import Button from './Button'
import AddTask from './AddTask'
import Tasks from './Tasks'
import EditProject from './EditProject'
import moment from 'moment';

function Project({project, onDelete, onEdit}){
    const [tasks, setTasks] = useState([
        {
            id: '0',
            name: 'First Part',
            dueDate: new Date("8/20/2021")
        },
        {
            id: '1',
            name: 'Second Part',
            dueDate: new Date("5/10/2021")
        },
        {
            id: '2',
            name: 'Third Part',
            dueDate: new Date("1/2/2021")
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
                    {moment(project.dueDate).format('MMMM d, yyyy - h:mm a')}
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
