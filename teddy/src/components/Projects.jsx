import React from 'react'
import Project from './Project'

function Projects({projects, onDelete, onEdit}){
    return (
        <ul className='projects'>
            {
            projects.map((project) => 
            <Project key={project.id} project={project} onDelete={onDelete} onEdit={onEdit}/>
            )}
        </ul>
    )
}

export default Projects
