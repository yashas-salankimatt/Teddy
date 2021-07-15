import React, {useEffect, useState} from 'react';
import './Popup.css';

function CreateSubtaskPopup({trigger=false, setTrig, updateParentData}) {
    const [subtaskName, setName] = useState('');
    const [completed, setCompleted] = useState(false);
    const [description, setDescription] = useState('');
    const [minsNeeded, setMinsNeeded] = useState(0);

    const createSubtask = () => {
        const updateTaskData = {
            subtaskName: subtaskName,
            completed: completed,
            description: description,
            minutesNeeded: minsNeeded
        };
        updateParentData({newSubtaskData:updateTaskData});
        setTrig(false);
    };

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Create Subtask</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Subtask Name: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setName(event.target.value)}}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Completed: </h5>
                    <form>
                        <input className='form-check-input' type='checkbox' onChange={(event) => {setCompleted(event.target.checked)}}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Description: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setDescription(event.target.value)}}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Minutes Needed: </h5>
                    <form>
                        <input className='form-control' type='number' onChange={(event) => {setMinsNeeded(event.target.value)}}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {createSubtask()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default CreateSubtaskPopup;