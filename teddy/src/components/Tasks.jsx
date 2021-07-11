import React, {useEffect, useState} from 'react';
import { deleteTask, getProjDoc } from '../utils/FirestoreConfig';
import './Tasks.css';

function Tasks({catID, projID, deleteProjFunction}) {
    var tasks = [];
    var currTaskName = null;

    const [projDoc, setProjDoc] = useState(null);
    const [projectName, setProjName] = useState("");
    const [taskState, setTaskState] = useState([]);
    const [showChildren, setShowChildren] = useState(false);

    // TODO IMPLEMENT CREATE TASK POPUP
    const createTask = ({taskName}) => {

    };

    const deleteTaskState = ({taskID=null, taskName=null}) => {
        deleteTask({projDoc, taskName, taskID}).then((retID) => {
            taskID = retID;
        });

        const findInd = tasks.findIndex((element) => {
            return (element.taskID === taskID || element.taskName === taskName);
        })
        if (findInd >= 0){
            tasks.splice(findInd, 1);
        }
        setTaskState(tasks.map((task) => task.taskID));
    };

    useEffect(() => {
        getProjDoc({categoryID: catID, projectID: projID}).then((ret) => {
            setProjDoc(ret);
        });
    }, []);

    useEffect(() => {
        tasks = [];
        if (projDoc){
            projDoc.get().then((retDoc) => {
                setProjName(retDoc.data().projectName);
            });
            async function fetchData() {
                try {
                    const snapshot = await projDoc.collection("tasks").get();
                    if (snapshot.empty){
                        console.log("No tasks for project " + projectName);
                        return;
                    }
                    snapshot.forEach((task) => {
                        tasks.push({
                            taskID: task.id,
                            taskDoc: task.ref,
                            taskName: task.data().taskName,
                            description: task.data().description,
                            complete: task.data().completed,
                            dueDate: task.data().dueDate
                        });
                    });
                    setTaskState(tasks.map((task) => task.taskID));
                } catch(error) {
                    console.log("Error in trying to get tasks for project " + projectName);
                    console.log(error);
                }
            }
            fetchData();
        }
    }, [projDoc]);

    useEffect(() => {
        console.log(taskState);
    }, [taskState]);

    return (
        <div className='ProjectItem'>
            {projDoc && <li className='ProjectListItem' key={projDoc.id}>
                {projectName}
                <button className='EditButton btn btn-secondary' onClick={() => {
                    setShowChildren(!showChildren);
                }}>Show/Hide Tasks</button>
                <button className='EditButton btn btn-secondary'>Edit</button>
                <button className='DeleteButton btn btn-secondary' onClick={() => {deleteProjFunction({projectID: projID})}}>Delete</button>
                {showChildren && <div>
                    <h5>Tasks</h5>
                    <div className='CreateTaskWrapper'>
                        <form>
                            <input className='form-control' type='text' placeholder="Enter task name" name="taskInput"></input>
                        </form>
                    </div>
                    <ul className='TasksList'>
                        {taskState.map((element) => (
                            <li key={element}>{element}</li>
                        ))}
                    </ul>
                </div>}
            </li>}
        </div>
    );
}

export default Tasks;