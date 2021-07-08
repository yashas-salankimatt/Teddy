import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import React from 'react'
import Projects from './Projects'
import Button from './Button'
import AddProject from './AddProject'
import EditCourse from './EditCourse'

function Course({course, onDelete, onEdit}) {
    const [projects, setProjects] = useState([])

    const [showAddProject, setShowAddProject] = useState(false)
    const [showEditCourse, setShowEditCourse] = useState(false)

    const[courseIsOpen, setCourseIsOpen] = useState(false)
    const toggleCourse = () => setCourseIsOpen(!courseIsOpen)

    const addProject = (project) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newProject = {id, ...project}
        setProjects([...projects, newProject])
    }

    const deleteProject = (id) => {
        setProjects(projects.filter((project) => project.id !== id))
    }

    const editProject = (editProject) => {   
        setProjects(projects.map(function(project) {
            if (project.id !== editProject.id){
                return project
            } else {
                return editProject
            }
        }, this))
    }

    const updateProjectMinutes = (newProject) => {
        setProjects(projects.map(function(project) {
            if (project.id !== newProject.id){
                console.log('here')
                return project
            } else {
                console.log(newProject.minutes)
                return newProject
            }
        }, this))
    }

    return (
        
        <li className='course'>
            <div>
                <h3>
                    {course.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(course.id)}/>
                </h3>

                <Button color={showAddProject ? 'red' : 'green'} text={showAddProject ? 'Close' : 'Add Project'} 
                onClick={() => setShowAddProject(!showAddProject)}/>
                {showAddProject && <AddProject onAdd = {addProject}/>}

                <Button color={showEditCourse ? 'red' : 'green'} text={showEditCourse ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditCourse(!showEditCourse)}/>
                {showEditCourse && <EditCourse onEdit = {onEdit} course = {course}/>}

                <Button color={courseIsOpen ? 'red' : 'green'} text={courseIsOpen ? 'Close Projects' : 'Show Projects'} 
                    onClick={toggleCourse}/>
                {
                    courseIsOpen && (projects.length>0 ? (<Projects projects = {projects} onDelete={deleteProject} onEdit={editProject} updateMinutes={updateProjectMinutes}/>) : ('No projects to show'))
                }
            </div>

        </li>
    );
}

export default Course

