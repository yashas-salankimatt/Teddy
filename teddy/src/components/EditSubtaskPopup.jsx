import React, {useEffect, useState} from 'react';
import './Popup.css';

function EditSubtaskPopup({trigger=false, subtaskData, setTrig, updateParentData}) {
    const [subtaskDocData, setSubtaskDocData] = useState();
    const [subtaskName, setName] = useState('');
    const [completed, setCompleted] = useState(false);
    const [description, setDescription] = useState('');
    const [minsNeeded, setMinsNeeded] = useState(0);

    useEffect(() => {
        setSubtaskDocData(subtaskData.element);
        setName(subtaskData.element.subtaskName);
        setCompleted(subtaskData.element.completed);
        setDescription(subtaskData.element.description);
        setMinsNeeded(subtaskData.element.minutesNeeded);
    }, []);

    const updateSubtask = () => {
        const subtaskDoc = subtaskDocData.subtaskDoc;
        const updateTaskData = {
            subtaskName: subtaskName,
            completed: completed,
            description: description,
            minutesNeeded: minsNeeded
        };
        subtaskDoc.update(updateTaskData);
        updateParentData({newSubtaskData:updateTaskData});
        setTrig(false);
    };

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Edit Subtask: {subtaskDocData.subtaskName}</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Subtask Name: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setName(event.target.value)}} defaultValue={subtaskData.element.subtaskName}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Completed: </h5>
                    <form>
                        <input className='form-check-input' type='checkbox' onChange={(event) => {setCompleted(event.target.checked)}} checked={completed}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Description: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setDescription(event.target.value)}} defaultValue={subtaskData.element.description}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Minutes Needed: </h5>
                    <form>
                        <input className='form-control' type='number' onChange={(event) => {setMinsNeeded(event.target.value)}} defaultValue={subtaskData.element.minutesNeeded}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateSubtask()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default EditSubtaskPopup;