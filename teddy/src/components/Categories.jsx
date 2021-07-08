import React from 'react'
import Category from './Category'

function Categories({categories, onDelete, onEdit}){
    return (
        <ul>
            {
            categories.map((category) => 
            <Category key={category.id} category={category} onDelete={onDelete} onEdit={onEdit}/>)
            }
        </ul>
    )
}

export default Categories