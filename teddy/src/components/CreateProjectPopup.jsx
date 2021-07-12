import React, { useEffect, useState } from 'react';
import { fb } from '../utils/FirebaseConfig';
import './EditProjectPopup.css';

function CreateProjectPopup({trigger=false, setTrig, updateParentData}) {
    const [projName, setName] = useState('');
    const [completed, setCompleted] = useState(false);
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState();


    const [dueDateStr, setDueDateStr] = useState();
    const [dueTimeStr, setDueTimeStr] = useState();

    const createProj = () => {
        const updateProjData = {
            projectName: projName,
            completed: completed,
            description: description,
            dueDate: dueDate
        };
        updateParentData({newProjData:updateProjData});
        setTrig(false);
    };

    useEffect(() => {
        setDueDateStr('');
        setDueTimeStr('');
    }, []);

    useEffect(() => {
        var date = new Date(dueDateStr);
        if (dueDateStr){
            if (dueTimeStr){
                date = new Date(dueDateStr+'T'+dueTimeStr+':00');
            }
            else {
                date = new Date(dueDateStr+'T00:00:00');
            }
        }
        console.log(date);
        setDueDate(fb.firestore.Timestamp.fromDate(date));
    }, [dueDateStr, dueTimeStr]);

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Create Project</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Project Name: </h5>
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
                    <h5 className='m-1'>Due Date: </h5>
                    <form>
                        <input type='date' onChange={(event) => {setDueDateStr(event.target.value)}}></input>
                        <input type='time' onChange={(event) => {setDueTimeStr(event.target.value)}}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {createProj()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default CreateProjectPopup;