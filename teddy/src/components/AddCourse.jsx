import { useState } from 'react'

const AddCourse = ({ onAdd }) => {
    const [name, setName] = useState('')


    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        onAdd( {name} )

        setName('')
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Course Name</label>
                <input type='text' placeholder='Add Course Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <input type='submit' value='Save Course' className='btn btn-block'/>
        </form>
    )
}

export default AddCourse