import React, {useEffect, useState} from 'react';
import './Subtask.css';
import EditSubtaskPopup from './EditSubtaskPopup';

function Subtask({subtaskData, deleteSubtaskFunction}) {
    const [subtaskDoc, setSubtaskDoc] = useState(null);
    const [subtaskName, setSubtaskName] = useState('');

    const [showEditSubtaskPopup, setShowEditPopup] = useState(false);

    useEffect(() => {
        setSubtaskDoc(subtaskData.element.subtaskDoc);
        setSubtaskName(subtaskData.element.subtaskName);
    }, []);

    useEffect(() => {
        setSubtaskDoc(subtaskData.element.subtaskDoc);
        setSubtaskName(subtaskData.element.subtaskName);
    }, [subtaskData]);

    function updateSubtaskData ({newSubtaskData}) {
        setSubtaskName(newSubtaskData.subtaskName);
        subtaskData.element.subtaskName = newSubtaskData.subtaskName;
        subtaskData.element.completed = newSubtaskData.completed;
        subtaskData.element.description = newSubtaskData.description;
        subtaskData.element.minutesNeeded = newSubtaskData.minutesNeeded;
    };

    return (
        <div className='SubtaskItem'>
            {subtaskDoc && <li className='SubtaskListItem' key={subtaskDoc.id}>
                {subtaskName}
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteSubtaskFunction({subtaskID: subtaskDoc.id})}}>Delete</button>
                <EditSubtaskPopup trigger={showEditSubtaskPopup} subtaskData={subtaskData} setTrig={setShowEditPopup} updateParentData={updateSubtaskData}></EditSubtaskPopup>
            </li>}
        </div>
    );
}

export default Subtask;