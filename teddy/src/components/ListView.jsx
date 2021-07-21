import React, { useEffect, useState } from 'react';
// import { getAllSubtasks, updateAllSubtasks } from '../providers/MasterDataProvider';
import {auth, firestore} from '../utils/FirebaseConfig';
import ListViewItem from './ListViewItem';
import './ListView.css';
import { getEvents } from './CalendarWrapper';

/* TODO
- Need to have a function that will sort subtasks by dueDate once they are loaded
*/

function ListView(props) {
    const [allSubtasks, setAllSubtasks] = useState([]);
    const [refreshed, setRefreshed] = useState(false);

    const updateAllSubtasks = () => {
        try {
            if (auth.currentUser !== null){
                var allSubtasks2 = [];
                const user = auth.currentUser;
                const userRef = firestore.collection("users").doc(user.uid);
                userRef.collection("todo").get().then((todoDocs) => {
                    todoDocs.forEach((todoDoc) => {
                        todoDoc.ref.collection("projects").get().then((projectDocs) => {
                            projectDocs.forEach((projectDoc) => {
                                projectDoc.ref.collection("tasks").get().then((taskDocs) => {
                                    taskDocs.forEach((taskDoc) => {
                                        taskDoc.ref.collection("subtasks").get().then((subtaskDocs) => {
                                            subtaskDocs.forEach((subtaskDoc) => {
                                                allSubtasks2.push({
                                                    categoryName: todoDoc.data().categoryName,
                                                    projectName: projectDoc.data().projectName,
                                                    taskName: taskDoc.data().taskName,
                                                    dueDate: taskDoc.data().dueDate,
                                                    subtaskName: subtaskDoc.data().subtaskName,
                                                    minutesNeeded: subtaskDoc.data().minutesNeeded,
                                                    completed: subtaskDoc.data().completed,
                                                    description: subtaskDoc.data().description,
                                                    path: subtaskDoc.ref.path,
                                                    subtaskDoc: subtaskDoc.ref
                                                });
                                            });
                                            setAllSubtasks(allSubtasks2);
                                            // console.log(allSubtasks2);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        } catch (error) {
            console.log("Error when trying to get all subtasks");
            console.log(error);
        }
    };
    
    useEffect(() => {
        updateAllSubtasks();
    }, []);

    useEffect(() => {
        console.log("updated", allSubtasks);
        allSubtasks.sort((a, b) => (a.dueDate.toMillis() > b.dueDate.toMillis()) ? 1 : -1);
    }, [allSubtasks]);

    function refresh() {
        console.log(refreshed);
        console.log(allSubtasks)
        var tempSubtasks = allSubtasks.concat();
        tempSubtasks.push({});
        setAllSubtasks(tempSubtasks);
        setAllSubtasks(prevSubtasks => prevSubtasks.slice(0, -1));
        
        setRefreshed(true);
    }

    async function basicScheduler() {
        const user = auth.currentUser;
        const prefDoc = await firestore.collection("users").doc(user.uid).collection("prefs").doc("workPrefs").get();
        const prefDuration = prefDoc.data().prefDuration;
        const startDateTime = new Date();
        var calendarEvents = await getEvents();

    }
    
    return (
        <div>
            <h2>List View</h2>
            <div className='ListViewItemWrapper' style={{justifyContent:'center'}}>
                <button className='btn btn-secondary m-1' onClick={refresh}>Refresh</button>
                <button className='btn btn-secondary m-1' onClick={() => {}}>Plan Events</button>
            </div>
            {refreshed && <ul key='ListView'>
                {allSubtasks.map((subtask) => 
                    // <li>{subtask.subtaskName}</li>
                    <ListViewItem subtaskData={subtask} key={subtask.path}/>
                )}
            </ul>}
        </div>
    );
}

export default ListView;