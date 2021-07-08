import { useState } from 'react'
import React from 'react'
import Categories from './Categories'
import Button from './Button'
import AddCategory from './AddCategory'
import BucketViewHeader from './BucketViewHeader'

function BucketView(props) {
    const [categories, setCategories] = useState([])

    const [showAddCategory, setShowAddCategory] = useState(false)

    const addCategory = (category) => {
        const id = Math.floor(Math.random() * 10000) + 1
        console.log(id)
        const newCategory = {id, ...category}
        setCategories([...categories, newCategory])
    }

    const deleteCategory = (id) => {
        setCategories(categories.filter((category) => category.id !== id))
    }

    const editCategory = (editCategory) => {   
        setCategories(categories.map(function(category) {
            if (category.id !== editCategory.id){
                return category
            } else {
                return editCategory
            }
        }, this))
    }

    return (
        
        <div className='bucketView'>
            <BucketViewHeader/>
            <Button color={showAddCategory ? 'red' : 'green'} text={showAddCategory ? 'Close' : 'Add Category'} 
            onClick={() => setShowAddCategory(!showAddCategory)}/>
            <div className='bucketScroll'>
                {showAddCategory && <AddCategory onAdd = {addCategory}/>}
                {
                categories.length>0 ? (<Categories categories = {categories} onDelete={deleteCategory} onEdit={editCategory} />) : ('Add a category to get started!')
                }
            </div>

        </div>
    );
}

export default BucketView;