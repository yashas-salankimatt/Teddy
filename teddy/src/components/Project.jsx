import React from 'react'
import { FaTimes } from 'react-icons/fa'

function Project({project, onDelete}){
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
            </div>
        </li>
    )
}

export default Project
