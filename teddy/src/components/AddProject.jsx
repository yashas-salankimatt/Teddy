import { useState } from 'react'

const AddProject = ({ onAdd }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        onAdd( {name, description} )

        setName('')
        setDescription('')
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Project Name</label>
                <input type='text' placeholder='Add Project Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className = 'form-control'>
                <label>Project Description</label>
                <input type='text' placeholder='Add Project Description' value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>

            <input type='submit' value='Save Task' className='btn btn-block'/>
        </form>
    )
}

export default AddProject