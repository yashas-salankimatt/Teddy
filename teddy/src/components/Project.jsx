import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import Button from './Button'
import AddTask from './AddTask'
import Tasks from './Tasks'
import EditProject from './EditProject'
import moment from 'moment';

function Project({project, onDelete, onEdit, updateMinutes}){
    const [tasks, setTasks] = useState([])
    

    const [showAddTask, setShowAddTask] = useState(false);

    const [showEditProject, setShowEditProject] = useState(false);

    const[projectIsOpen, setProjectIsOpen] = useState(false);
    const toggleProject = () => setProjectIsOpen(!projectIsOpen);

    const [projectDone, setProjectDone] = useState({ labelChecked: false });
    const labelRef = React.createRef();

    const handleCheck = e => {
        if (projectDone.labelChecked === false) {
          labelRef.current.style.textDecoration = "line-through";
        } else {
          labelRef.current.style.textDecoration = "none";
        }
        setProjectDone({ labelChecked: !projectDone.labelChecked });
    }

    const addTask = (task) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newTask = {id, ...task}
        setTasks([...tasks, newTask])
    }

    const deleteTask = (id) => {
        let name = project.name
        let dueDate = project.dueDate
        let minutes = +project.minutes - tasks.find(task => task.id === id).minutes
        setTasks(tasks.filter((task) => task.id !== id))
        id = project.id
        const newProject = {id, name, dueDate, minutes}
        updateMinutes(newProject)

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

    const updateTaskMinutes = (newTask) => {
        setTasks(tasks.map(function(task) {
            if (task.id !== newTask.id){
                console.log('here')
                return task
            } else {
                console.log(newTask.minutes)
                let id = project.id
                let name = project.name
                let dueDate = project.dueDate
                let minutes = (+project.minutes - task.minutes) + +newTask.minutes
                const newProject = {id, name, dueDate, minutes}
                updateMinutes(newProject)
                return newTask
            }
        }, this))
    }

    return (
        <li className='project'>
            <div>
                <h3 ref={labelRef}>
                    <input type='checkbox' onClick={handleCheck}/>
                    {project.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(project.id)}/>
                </h3>
                <p>
                    {moment(project.dueDate).format('MMMM d, yyyy - h:mm a')}
                </p>
                <p>
                    Total Project Time: {project.minutes} minutes
                </p>
                <Button color={showAddTask ? 'red' : 'green'} text={showAddTask ? 'Close' : 'Add Task'} 
                    onClick={() => setShowAddTask(!showAddTask)}/>
                {showAddTask && <AddTask onAdd = {addTask}/>}

                <Button color={showEditProject ? 'red' : 'green'} text={showEditProject ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditProject(!showEditProject)}/>
                {showEditProject && <EditProject onEdit = {onEdit} project = {project}/>}

                <Button color={projectIsOpen ? 'red' : 'green'} text={projectIsOpen ? 'Close Tasks' : 'Show Tasks'} 
                    onClick={toggleProject}/>
                {
                    projectIsOpen && (tasks.length>0 ? (<Tasks tasks = {tasks} onDelete={deleteTask} onEdit={editTask} updateMinutes={updateTaskMinutes}/>) : ('No tasks to show'))
                }
                

            </div>
        </li>
    )
}

export default Project
