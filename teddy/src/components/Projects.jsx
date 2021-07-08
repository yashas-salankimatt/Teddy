import React from 'react'
import Project from './Project'

function Projects({projects, onDelete, onEdit, updateMinutes}){
    return (
        <ul>
            {
            projects.map((project) => 
            <Project key={project.id} project={project} onDelete={onDelete} onEdit={onEdit} updateMinutes={updateMinutes}/>
            )}
        </ul>
    )
}

export default Projects
