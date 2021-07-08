import { useState } from 'react'
import React from 'react'
import Courses from './Courses'
import Button from './Button'
import AddCourse from './AddCourse'
import BucketViewHeader from './BucketViewHeader'

function BucketView(props) {
    const [courses, setCourses] = useState([])

    const [showAddCourse, setShowAddCourse] = useState(false)

    const addCourse = (course) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newCourse = {id, ...course}
        setCourses([...courses, newCourse])
    }

    const deleteCourse = (id) => {
        setCourses(courses.filter((course) => course.id !== id))
    }

    const editCourse = (editCourse) => {   
        setCourses(courses.map(function(course) {
            if (course.id !== editCourse.id){
                return course
            } else {
                return editCourse
            }
        }, this))
    }

    return (
        
        <div className='bucketView'>
            <BucketViewHeader/>
            <Button color={showAddCourse ? 'red' : 'green'} text={showAddCourse ? 'Close' : 'Add Course'} 
            onClick={() => setShowAddCourse(!showAddCourse)}/>
            <div className='bucketScroll'>
                {showAddCourse && <AddCourse onAdd = {addCourse}/>}
                {
                courses.length>0 ? (<Courses courses = {courses} onDelete={deleteCourse} onEdit={editCourse} />) : ('Add a course to get started!')
                }
            </div>

        </div>
    );
}

export default BucketView;