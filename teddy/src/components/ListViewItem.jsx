import React, { useEffect, useState } from 'react';
import EditSubtaskPopup from './EditSubtaskPopup';
import './ListView.css'

// TODO:
// Implement a system to somewhat nicely see all of the subtasks - Done
// Also need to see what parents they belong to - Done
// Also need to know what the duedate and time is - Done
// Also need to know the minutes needed for this subtask - Done
// Also need to be able to complete the task from a checkbox in listview - Done
// Item should be struck through if the subtask is done - Done
// Also implement edit and delete buttons, edit through existing popup - Edit is done

function ListViewItem({subtaskData}) {
    const [subtaskName, setSubtaskName] = useState();
    const [parentPath, setParentPath] = useState();
    const [dueDate, setDueDate] = useState();
    const [dueDateString, setDueDateString] = useState(null);
    const [minutesNeeded, setMinutesNeeded] = useState();
    const [completed, setCompleted] = useState();
    const [showEditPopup, setEditPopup] = useState(false);

    useEffect(() => {
        if (subtaskData) {
            setSubtaskName(subtaskData.subtaskName);
            const {categoryName, projectName, taskName} = subtaskData;
            const parentString = categoryName + "/" + projectName + "/" + taskName + "/";
            setParentPath(parentString);
            setDueDate(subtaskData.dueDate);
            setMinutesNeeded(subtaskData.minutesNeeded);
            setCompleted(subtaskData.completed);
        }
    }, []);
    
    useEffect(() => {
        // console.log(dueDate);
        if (dueDate) {
            const date = dueDate.toDate();
            const hour = date.getHours();
            const minutes = date.getMinutes();
            if (hour === 0 && minutes === 0){
                setDueDateString(date.toDateString());
            } else {
                setDueDateString(date.toDateString() + " " + hour + ":" + minutes);
            }
        }
    }, [dueDate]);

    useEffect(() => {
        if (completed !== null && completed !== undefined){
            subtaskData.subtaskDoc.update({completed: completed});
        }
    }, [completed]);

    function updateDataFromEdit({newSubtaskData}){
        setSubtaskName(newSubtaskData.subtaskName);
        setCompleted(newSubtaskData.completed);
        setMinutesNeeded(newSubtaskData.minutesNeeded);
    }
    
    return (
        <div style={{width:'100%'}}>
            {subtaskData && <div className='ListViewItemWrapper'>
                <form>
                    <input className='form-check-input' type='checkbox' onClick={(event) => {setCompleted(event.target.checked)}} checked={completed}></input>
                </form>
                <h6 className={'SubtaskText' + (completed ? ' completed' : '')} onClick={() => {setEditPopup(true)}}>{subtaskName}</h6>
                <button className='BubbleStyling' style={{cursor:'default'}}>{parentPath}</button>
                <button className='BubbleStyling' onClick={() => {setEditPopup(true)}}>{dueDateString}</button>
                <button className='BubbleStyling' onClick={() => {setEditPopup(true)}}>{minutesNeeded} mins</button>
                <EditSubtaskPopup trigger={showEditPopup} subtaskData={{element: subtaskData}} setTrig={setEditPopup} updateParentData={updateDataFromEdit}/>
            </div>}
        </div>
    );
}

export default ListViewItem;