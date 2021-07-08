import { useState } from 'react'

const EditCategory = ({ onEdit , category}) => {
    const [name, setName] = useState(category.name)

    const onSubmit = (e) => {
        e.preventDefault()

        if (!name) {
            alert('Please add a text')
            return
        }

        let id = category.id
        
        onEdit( { id, name} )

        setName('')
    }

    return (
        <form className = 'add-form' onSubmit={onSubmit}>
            <div className = 'form-control'>
                <label>Category Name</label>
                <input type='text' placeholder='Add Category Name' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <input type='submit' value='Save Task' className='btn btn-block'/>
        </form>
    )
}

export default EditCategory