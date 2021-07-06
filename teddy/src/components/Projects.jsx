import React from 'react'
import Project from './Project'

function Projects({projects, onDelete}){
    return (
        <ul className='projects'>
            {
            projects.map((project) => 
            <Project key={project.id} project={project} onDelete={onDelete}/>
            )}
        </ul>
    )
}

export default Projects
