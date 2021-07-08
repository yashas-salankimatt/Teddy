import React from 'react'
import Course from './Course'

function Courses({courses, onDelete, onEdit}){
    return (
        <ul className='courses'>
            {
            courses.map((course) => 
            <Course key={course.id} course={course} onDelete={onDelete} onEdit={onEdit}/>)
            }
        </ul>
    )
}

export default Courses