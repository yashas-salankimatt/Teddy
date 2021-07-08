import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import React from 'react'
import Projects from './Projects'
import Button from './Button'
import AddProject from './AddProject'
import EditCategory from './EditCategory'

function Category({category, onDelete, onEdit}) {
    const [projects, setProjects] = useState([])

    const [showAddProject, setShowAddProject] = useState(false)
    const [showEditCategory, setShowEditCategory] = useState(false)

    const[categoryIsOpen, setCategoryIsOpen] = useState(false)
    const toggleCategory = () => setCategoryIsOpen(!categoryIsOpen)

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
        
        <li>
            <div className='category'>
                <h3>
                    {category.name}
                    <FaTimes style = {{color: 'red', cursor: 'pointer',}} onClick={() => onDelete(category.id)}/>
                </h3>

                <Button color={showAddProject ? 'red' : 'green'} text={showAddProject ? 'Close' : 'Add Project'} 
                onClick={() => setShowAddProject(!showAddProject)}/>
                {showAddProject && <AddProject onAdd = {addProject}/>}

                <Button color={showEditCategory ? 'red' : 'green'} text={showEditCategory ? 'Close' : 'Edit'} 
                    onClick={() => setShowEditCategory(!showEditCategory)}/>
                {showEditCategory && <EditCategory onEdit = {onEdit} category = {category}/>}

                <Button color={categoryIsOpen ? 'red' : 'green'} text={categoryIsOpen ? 'Close Projects' : 'Show Projects'} 
                    onClick={toggleCategory}/>
                {
                    categoryIsOpen && (projects.length>0 ? (<Projects projects = {projects} onDelete={deleteProject} onEdit={editProject} updateMinutes={updateProjectMinutes}/>) : ('No projects to show'))
                }
            </div>

        </li>
    );
}

export default Category

