import { useState } from 'react'
import React from 'react'
import Projects from './Projects'
import Button from './Button'
import AddProject from './AddProject'

function BucketView(props) {
    const [projects, setProjects] = useState([
        {
            id: '0',
            name: 'Bucket feature',
            description: "Need to create a project-task structure for the buckets"
        },
        {
            id: '1',
            name: 'Calendar feature',
            description: "Need to have a customizable calendar"
        },
        {
            id: '2',
            name: 'Drag and Drop feature',
            description: "Need to have drag and drop functionality on top of automation"
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

    return (
        <div className='bucketView'>
            <h1 style={{ backgroundColor: "gray" }}>Bucket View</h1>
            <Button color={showAddProject ? 'red' : 'green'} text={showAddProject ? 'Close' : 'Add'} 
            onClick={() => setShowAddProject(!showAddProject)}/>
            {showAddProject && <AddProject onAdd = {addProject}/>}
            {
              projects.length>0 ? (<Projects projects = {projects} onDelete={deleteProject}/>) : ('No projects to show')
            }

        </div>
    );
}

export default BucketView;