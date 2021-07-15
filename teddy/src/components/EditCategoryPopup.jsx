import React, { useEffect, useState } from 'react';
import './Popup.css';

function EditCategoryPopup({trigger=false, catData, setTrig, updateParentData}) {
    const [catDocData, setCatDocData] = useState();
    const [catName, setName] = useState('');
    const [catArchived, setArchived] = useState();

    // useEffect(() => {
    //     // console.log(initialCatDoc.id);
    //     setCatDoc(initialCatDoc);
    // }, []);

    useEffect(() => {
        setCatDocData(catData.element);
        setName(catData.element.categoryName);
        setArchived(catData.element.archived);
        // console.log(catData.element.archived);
    }, []);

    const updateCategory = () => {
        // console.log(catName, catArchived);
        const catDoc = catDocData.catDoc;
        const updateCatData = {
            categoryName: catName,
            archived: catArchived 
        };
        catDoc.update(updateCatData);
        updateParentData({newCatData:updateCatData});
        setTrig(false);
    };

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Edit Category: {catDocData.categoryName}</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Category Name: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setName(event.target.value)}} defaultValue={catData.element.categoryName}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Archived: </h5>
                    <form>
                        <input className='form-check-input' type='checkbox' onChange={(event) => {setArchived(event.target.checked)}} checked={catArchived}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateCategory()}}>Save Changes</button>
            </div>
        </div>
    ) : "";
}

export default EditCategoryPopup;