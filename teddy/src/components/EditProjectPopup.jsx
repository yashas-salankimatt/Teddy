import React, { useEffect, useState } from 'react';
import { fb } from '../utils/FirebaseConfig';
import './EditProjectPopup.css';

function EditProjectPopup({trigger=false, projData, setTrig, updateParentData}) {
    const [projDocData, setProjDocData] = useState();
    const [projName, setName] = useState('');
    const [completed, setCompleted] = useState();
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState();


    const [dueDateStr, setDueDateStr] = useState();
    const [dueTimeStr, setDueTimeStr] = useState();

    useEffect(() => {
        setProjDocData(projData.element);
        setName(projData.element.projectName);
        setCompleted(projData.element.completed);
        setDescription(projData.element.description);
        setDueDate(projData.element.dueDate);
        
        var year = projData.element.dueDate.toDate().getFullYear().toString();
        var month = projData.element.dueDate.toDate().getMonth().toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day = projData.element.dueDate.toDate().getDate().toString();
        if (day.length === 1){
            day = '0' + day;
        }
        setDueDateStr(year+'-'+month+'-'+day);
        var hours = projData.element.dueDate.toDate().getHours().toString();
        if (hours.length === 1){
            hours = '0' + hours;
        }
        var mins = projData.element.dueDate.toDate().getMinutes().toString();
        if (mins.length === 1){
            mins = '0' + mins;
        }
        setDueTimeStr(hours+':'+mins);
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

    useEffect(() => {
        var date = new Date(dueDateStr+'T'+dueTimeStr+':00');
        // console.log(date);
        setDueDate(fb.firestore.Timestamp.fromDate(date));
    }, [dueDateStr, dueTimeStr]);

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Edit Project: {projDocData.projectName}</h3>
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
                        <input type='date' defaultValue={dueDateStr} onChange={(event) => {setDueDateStr(event.target.value)}}></input>
                        <input type='time' defaultValue={dueTimeStr} onChange={(event) => {setDueTimeStr(event.target.value)}}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateProject()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default EditProjectPopup;