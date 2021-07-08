import { useState } from 'react'

const EditCourse = ({ onEdit , course}) => {
    const [name, setName] = useState(course.name)

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        let id = course.id
        
        onEdit( { id, name} )

        setName('')
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Course Name</label>
                <input type='text' placeholder='Add Course Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <input type='submit' value='Save Task' className='btn btn-block'/>
        </form>
    )
}

export default EditCourse