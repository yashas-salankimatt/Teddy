import { useState } from 'react'
import React from 'react'
import Projects from './Projects'
import Button from './Button'
import AddProject from './AddProject'
import BucketViewHeader from './BucketViewHeader'

function BucketView(props) {
    const [projects, setProjects] = useState([
        {
            id: '0',
            name: 'Bucket feature',
            dueDate: new Date("8/20/2021"),
            minutes: 0,
        },
        {
            id: '1',
            name: 'Calendar feature',
            dueDate: new Date("5/10/2021"),
            minutes: 0,
        },
        {
            id: '2',
            name: 'Drag and Drop feature',
            dueDate: new Date("1/2/2021"),
            minutes: 0,
        },
    ])

    const [showAddProject, setShowAddProject] = useState(false)

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
        
        <div className='bucketView'>
            <BucketViewHeader/>
            <Button color={showAddProject ? 'red' : 'green'} text={showAddProject ? 'Close' : 'Add'} 
            onClick={() => setShowAddProject(!showAddProject)}/>
            <div className='bucketScroll'>
                {showAddProject && <AddProject onAdd = {addProject}/>}
                {
                projects.length>0 ? (<Projects projects = {projects} onDelete={deleteProject} onEdit={editProject} updateMinutes={updateProjectMinutes}/>) : ('No projects to show')
                }
            </div>

        </div>
    );
}

export default BucketView;