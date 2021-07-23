import React, { useEffect, useState } from 'react';
import {deleteSubtask, createSubtask} from '../utils/TaskDBConfig';
import './Subtasks.css';
import EditTaskPopup from './EditTaskPopup';
import Subtask from './Subtask';
import CreateSubtaskPopup from './CreateSubtaskPopup';
import DropDownIcon from '../icons/caret-right-fill.svg';

function Subtasks({taskData, deleteTaskFunction}) {
    const [subtasks, setSubtasks] = useState([]);
    const [taskDoc, setTaskDoc] = useState(null);
    const [taskName, setTaskName] = useState("");

    const [showChildren, setShowChildren] = useState(false);
    const [showEditTaskPopup, setShowEditPopup] = useState(false);
    const [showCreateSubtaskPopup, setCreateSubtaskPopup] = useState(false);
    
    const createSubtaskFunc = ({newSubtaskData}) => {
        createSubtask({
            subtaskName: newSubtaskData.subtaskName,
            minutesNeeded: newSubtaskData.minutesNeeded,
            taskDoc: taskDoc,
            description: newSubtaskData.description,
            completed: newSubtaskData.completed
        }).then((subtaskRef) => {
            if (subtaskRef){
                var tempSubtasks = subtasks.concat();
                tempSubtasks.push({
                    subtaskID: subtaskRef.id,
                    subtaskDoc: subtaskRef,
                    subtaskName: newSubtaskData.subtaskName,
                    minutesNeeded: newSubtaskData.minutesNeeded,
                    description: newSubtaskData.description,
                    completed: newSubtaskData.completed
                });
                setSubtasks(tempSubtasks);
            }
        });
    };

    const deleteSubtaskState = ({subtaskID=null, subtaskName=null}) => {
        deleteSubtask({taskDoc, subtaskName, subtaskID}).then((retID) => {
            subtaskID = retID;
        });

        var tempSubtasks = subtasks.concat();
        const findInd = tempSubtasks.findIndex((element) => {
            return (element.subtaskID === subtaskID);
        });
        if (findInd >= 0){
            tempSubtasks.splice(findInd, 1);
        }
        setSubtasks(tempSubtasks);
    };

    useEffect(() => {
        // setSubtasks([]);
        setTaskDoc(taskData.element.taskDoc);
        setTaskName(taskData.element.taskName);
    }, []);

    useEffect(() => {
        // setSubtasks([]);
        setTaskDoc(taskData.element.taskDoc);
        setTaskName(taskData.element.taskName);
        setShowChildren(false);
    }, [taskData]);

    useEffect(() => {
        setSubtasks([]);
        if (taskDoc) {
            async function fetchData() {
                try {
                    const snapshot = await taskDoc.collection("subtasks").get();
                    if (snapshot.empty){
                        console.log("No subtasks for task " + taskName);
                        return;
                    }
                    var tempSubtasks = subtasks.concat();
                    snapshot.forEach((subtask) => {
                        tempSubtasks.push({
                            subtaskID: subtask.id,
                            subtaskDoc: subtask.ref,
                            subtaskName: subtask.data().subtaskName,
                            minutesNeeded: subtask.data().minutesNeeded,
                            description: subtask.data().description,
                            completed: subtask.data().completed
                        });
                    });
                    setSubtasks(tempSubtasks);
                } catch (error) {
                    console.log("Error in trying to get subtasks for task " + taskName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [taskDoc]);

    function updateTaskData ({newTaskData}) {
        setTaskName(newTaskData.taskName);
        taskData.element.taskName = newTaskData.taskName;
        taskData.element.completed = newTaskData.completed;
        taskData.element.description = newTaskData.description;
        taskData.element.dueDate = newTaskData.dueDate;
    };

    return (
        <div className='TaskItem'>
            {taskDoc && <li className='TaskListItem' key={taskDoc.id}>
                <img className={"DropDownIcon " + (showChildren ? 'active' : '')} src={DropDownIcon} onClick={() => {setShowChildren(!showChildren)}} alt=">"/>
                {taskName}
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteTaskFunction({taskID: taskDoc.id})}}>Delete</button>
                <EditTaskPopup trigger={showEditTaskPopup} setTrig={setShowEditPopup} taskData={taskData} updateParentData={updateTaskData}></EditTaskPopup>
                {showChildren && <div>
                    <div className='CreateSubtaskWrapper'>
                        <CreateSubtaskPopup trigger={showCreateSubtaskPopup} setTrig={setCreateSubtaskPopup} updateParentData={createSubtaskFunc}></CreateSubtaskPopup>
                        <h4 className='m-2'>Subtasks</h4>
                        <button className='btn btn-secondary m-1' onClick={() => {setCreateSubtaskPopup(true)}}>Create Subtask</button>
                    </div>
                    <ul className='SubtasksList'>
                        {subtasks.map((element) => (
                            // <li key={element.subtaskID}>{element.subtaskName}</li>
                            <Subtask subtaskData={{element}} deleteSubtaskFunction={deleteSubtaskState} key={element.subtaskID}></Subtask>
                        ))}
                    </ul>
                </div>}
            </li>}
        </div>
    );
}

export default Subtasks;