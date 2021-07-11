import React, { useEffect, useState } from 'react';
import './EditProjectPopup.css';

function EditProjectPopup({trigger=false, projData, setTrig, updateParentData}) {
    const [projDocData, setProjDocData] = useState();
    const [projName, setName] = useState('');
    const [completed, setCompleted] = useState();
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState();

    useEffect(() => {
        setProjDocData(projData.element);
        setName(projData.element.projectName);
        setCompleted(projData.element.completed);
        setDescription(projData.element.description);
        setDueDate(projData.element.dueDate);
        console.log(projData.element.dueDate);
    }, []);

    const updateProject = () => {
        const projDoc = projDocData.projDoc;
        const updateProjData = {
            projectName: projName,
            completed: completed,
            description: description,
            dueDate: dueDate
        };
        projDoc.update(updateProjData);
        updateParentData({newProjData:updateProjData});
        setTrig(false);
    };

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Eid Project: {projDocData.projectName}</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Project Name: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setName(event.target.value)}} defaultValue={projData.element.projectName}></input>
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
                        <input className='form-control' type='text' onChange={(event) => {setDescription(event.target.value)}} defaultValue={projData.element.description}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Due Date: </h5>
                    <form>
                        <input type='date'></input>
                        <input type='time'></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateProject()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default EditProjectPopup;