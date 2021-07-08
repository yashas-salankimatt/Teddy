import React from 'react'
import Course from './Course'

function Courses({courses, onDelete, onEdit}){
    return (
        <ul>
            {
            courses.map((course) => 
            <Course key={course.id} course={course} onDelete={onDelete} onEdit={onEdit}/>)
            }
        </ul>
    )
}

export default Courses