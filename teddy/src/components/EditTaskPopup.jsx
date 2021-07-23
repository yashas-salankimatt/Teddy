import React, {useEffect, useState} from 'react';
import {fb} from '../utils/FirebaseConfig';
import './Popup.css';

function EditTaskPopup({trigger=false, taskData, setTrig, updateParentData}) {
    const [taskDocData, setTaskDocData] = useState();
    const [taskName, setName] = useState('');
    const [completed, setCompleted] = useState(false);
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState();


    const [dueDateStr, setDueDateStr] = useState('');
    const [dueTimeStr, setDueTimeStr] = useState('');

    useEffect(() => {
        setTaskDocData(taskData.element);
        setName(taskData.element.taskName);
        setCompleted(taskData.element.completed);
        setDescription(taskData.element.description);
        setDueDate(taskData.element.dueDate);

        var year = taskData.element.dueDate.toDate().getFullYear().toString();
        var month = taskData.element.dueDate.toDate().getMonth().toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        var day = taskData.element.dueDate.toDate().getDate().toString();
        if (day.length === 1){
            day = '0' + day;
        }
        setDueDateStr(year+'-'+month+'-'+day);
        var hours = taskData.element.dueDate.toDate().getHours().toString();
        if (hours.length === 1){
            hours = '0' + hours;
        }
        var mins = taskData.element.dueDate.toDate().getMinutes().toString();
        if (mins.length === 1){
            mins = '0' + mins;
        }
        setDueTimeStr(hours+':'+mins);
    }, []);

    const updateTask = () => {
        const taskDoc = taskDocData.taskDoc;
        const updateTaskData = {
            taskName: taskName,
            completed: completed,
            description: description,
            dueDate: dueDate
        };
        taskDoc.update(updateTaskData);
        updateParentData({newTaskData:updateTaskData});
        setTrig(false);
    };

    useEffect(() => {
        var date = new Date(dueDateStr+'T'+dueTimeStr+':00');
        setDueDate(fb.firestore.Timestamp.fromDate(date));
    }, [dueDateStr, dueTimeStr]);

    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>Edit Task: {taskDocData.taskName}</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Task Name: </h5>
                    <form>
                        <input className='form-control' type='text' onChange={(event) => {setName(event.target.value)}} defaultValue={taskData.element.taskName}></input>
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
                        <input className='form-control' type='text' onChange={(event) => {setDescription(event.target.value)}} defaultValue={taskData.element.description}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Due Date: </h5>
                    <form>
                        <input type='date' defaultValue={dueDateStr} onChange={(event) => {setDueDateStr(event.target.value)}}></input>
                        <input type='time' defaultValue={dueTimeStr} onChange={(event) => {setDueTimeStr(event.target.value)}}></input>
                    </form>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateTask()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default EditTaskPopup;