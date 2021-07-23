import React, {useEffect, useState} from 'react';
import { deleteTask, createTask} from '../utils/TaskDBConfig';
import './Tasks.css';
import EditProjectPopup from './EditProjectPopup';
import Subtasks from './Subtasks';
import CreateTaskPopup from './CreateTaskPopup';
import DropDownIcon from '../icons/caret-right-fill.svg';

function Tasks({projData, deleteProjFunction}) {
    const [tasks, setTasks] = useState([]);
    const [projDoc, setProjDoc] = useState(null);
    const [projectName, setProjName] = useState("");
    // const [taskState, setTaskState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);
    const [showEditProjPopup, setShowEditPopup] = useState(false);
    const [showCreateTaskPopup, setCreateTaskPopup] = useState(false);

    const createTaskFunc = ({newTaskData}) => {
        createTask({
            taskName: newTaskData.taskName,
            dueDate: newTaskData.dueDate,
            projDoc: projDoc,
            minutesNeeded: newTaskData.minutesNeeded,
            description: newTaskData.description,
            completed: newTaskData.completed
        }).then((taskRef) => {
            if (taskRef){
                var tempTasks = tasks.concat();
                tempTasks.push({
                    taskID: taskRef.id,
                    taskDoc: taskRef,
                    taskName: newTaskData.taskName,
                    description: newTaskData.description,
                    completed: newTaskData.completed,
                    dueDate: newTaskData.dueDate
                });
                setTasks(tempTasks);
            }
        });
    };

    const deleteTaskState = ({taskID=null, taskName=null}) => {
        deleteTask({projDoc, taskName, taskID}).then((retID) => {
            taskID = retID;
        });

        var tempTasks = tasks.concat();
        const findInd = tempTasks.findIndex((element) => {
            return (element.taskID === taskID);
        });
        if (findInd >= 0){
            tempTasks.splice(findInd, 1);
        }
        setTasks(tempTasks);
        // setTaskState(tasks.map((task) => task.taskID));
    };

    useEffect(() => {
        // setTasks([]);
        setProjDoc(projData.element.projDoc);
        setProjName(projData.element.projectName);
    }, []);

    useEffect(() => {
        setTasks([]);
        setProjDoc(projData.element.projDoc);
        setProjName(projData.element.projectName);
    }, [projData]);

    useEffect(() => {
        // tasks = [];
        setTasks([]);
        if (projDoc){
            // projDoc.get().then((retDoc) => {
            //     setProjName(retDoc.data().projectName);
            // });
            async function fetchData() {
                try {
                    const snapshot = await projDoc.collection("tasks").get();
                    if (snapshot.empty){
                        console.log("No tasks for project " + projectName);
                        return;
                    }
                    var tempTasks = tasks.concat();
                    snapshot.forEach((task) => {
                        tempTasks.push({
                            taskID: task.id,
                            taskDoc: task.ref,
                            taskName: task.data().taskName,
                            description: task.data().description,
                            completed: task.data().completed,
                            dueDate: task.data().dueDate
                        });
                    });
                    setTasks(tempTasks);
                    // setTaskState(tasks.map((task) => task.taskID));
                } catch(error) {
                    console.log("Error in trying to get tasks for project " + projectName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [projDoc]);

    // useEffect(() => {
    //     console.log(taskState);
    // }, [taskState]);

    function updateProjData ({newProjData}) {
        setProjName(newProjData.projectName);
        projData.element.projectName = newProjData.projectName;
        projData.element.completed = newProjData.completed;
        projData.element.description = newProjData.description;
        projData.element.dueDate = newProjData.dueDate;
    };

    return (
        <div key={projData.element.projectID}>
            {projDoc && <div className='ProjectItem'>
                <img className={"DropDownIcon " + (showChildren ? 'active' : '')} src={DropDownIcon} onClick={() => {setShowChildren(!showChildren)}} alt=">"/>
                <div className='ProjectListItem' key={projDoc.id}>
                    {projectName}
                    <EditProjectPopup trigger={showEditProjPopup} setTrig={setShowEditPopup} projData={projData} updateParentData={updateProjData}></EditProjectPopup>
                    {showChildren && <div>
                        <div className='CreateTaskWrapper'>
                            <CreateTaskPopup trigger={showCreateTaskPopup} setTrig={setCreateTaskPopup} updateParentData={createTaskFunc}></CreateTaskPopup>
                            <h4 className='m-2'>Tasks</h4>
                            <button className='btn btn-secondary m-1' onClick={() => {setCreateTaskPopup(true)}}>Create Task</button>
                        </div>
                        <ul className='TasksList' key={projData.element.projectID}>
                            {tasks.map((element) => (
                                // <div key={element.taskID}>{element.taskName}</div>
                                <Subtasks taskData={{element}} deleteTaskFunction={deleteTaskState} key={element.taskID}></Subtasks>
                                ))}
                        </ul>
                    </div>}
                </div>
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteProjFunction({projectID: projDoc.id})}}>Delete</button>
            </div>}
        </div>
    );
}

export default Tasks;