import React, {useEffect, useState} from 'react';
import { deleteTask} from '../utils/FirestoreConfig';
import './Tasks.css';
import EditProjectPopup from './EditProjectPopup';
import {fb} from '../utils/FirebaseConfig';

function Tasks({projData, deleteProjFunction}) {
    // var tasks = [];
    var currTaskName = null;

    const [tasks, setTasks] = useState([]);
    const [projDoc, setProjDoc] = useState(null);
    const [projectName, setProjName] = useState("");
    // const [taskState, setTaskState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);
    const [showEditProjPopup, setShowEditPopup] = useState(false);

    // TODO IMPLEMENT CREATE TASK POPUP
    const createTask = ({taskName}) => {

    };

    const deleteTaskState = ({taskID=null, taskName=null}) => {
        deleteTask({projDoc, taskName, taskID}).then((retID) => {
            taskID = retID;
        });

        var tempTasks = tasks;
        const findInd = tempTasks.findIndex((element) => {
            return (element.taskID === taskID || element.taskName === taskName);
        })
        if (findInd >= 0){
            tempTasks.splice(findInd, 1);
        }
        setTasks(tempTasks);
        // setTaskState(tasks.map((task) => task.taskID));
    };

    useEffect(() => {
        // getProjDoc({categoryID: catID, projectID: projID}).then((ret) => {
        //     setProjDoc(ret);
        // });
        setProjDoc(projData.element.projDoc);
        setProjName(projData.element.projectName);
    }, []);

    useEffect(() => {
        // tasks = [];
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
                    var tempTasks = tasks;
                    snapshot.forEach((task) => {
                        tempTasks.push({
                            taskID: task.id,
                            taskDoc: task.ref,
                            taskName: task.data().taskName,
                            description: task.data().description,
                            complete: task.data().completed,
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
        <div className='ProjectItem'>
            {projDoc && <li className='ProjectListItem' key={projDoc.id}>
                {projectName}
                <button className='EditButton btn btn-secondary' onClick={() => {
                    setShowChildren(!showChildren);
                }}>Show/Hide Tasks</button>
                <button className='EditButton btn btn-secondary' onClick={() => {setShowEditPopup(true)}}>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteProjFunction({projectID: projDoc.id})}}>Delete</button>
                <EditProjectPopup trigger={showEditProjPopup} setTrig={setShowEditPopup} projData={projData} updateParentData={updateProjData}></EditProjectPopup>
                {showChildren && <div>
                    <div className='CreateTaskWrapper'>
                        <h5 className='m-2'>Tasks</h5>
                        <button className='btn btn-secondary m-1'>Create Task</button>
                    </div>
                    <ul className='TasksList'>
                        {tasks.map((element) => (
                            <li key={element.taskID}>{element.taskName}</li>
                        ))}
                    </ul>
                </div>}
            </li>}
        </div>
    );
}

export default Tasks;