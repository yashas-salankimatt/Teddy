import React from 'react';
import './EditCategoryPopup.css';

function EditCategoryPopup({trigger=true, catDoc, setTrig}) {
    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-ntn' onClick={() => {setTrig(false)}}>Close</button>
                <h1>Edit Category {catDoc.id}</h1>
            </div>
        </div>
    ) : "";
}

export default EditCategoryPopup;