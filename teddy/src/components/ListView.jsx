import React, { useEffect, useState } from 'react';
// import { getAllSubtasks, updateAllSubtasks } from '../providers/MasterDataProvider';
import {auth, firestore} from '../utils/FirebaseConfig';
import ListViewItem from './ListViewItem';
import './ListView.css';
import {updateAllSubtasks, basicScheduler2} from '../providers/MasterDataProvider';

/* TODO
- Need to have a function that will sort subtasks by dueDate once they are loaded
*/

function ListView(props) {
    const [allSubtasks, setAllSubtasks] = useState([]);
    const [refreshed, setRefreshed] = useState(false);
    
    useEffect(() => {
        updateAllSubtasks(setAllSubtasks);
    }, []);

    useEffect(() => {
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
    
    return (
        <div>
            <h2>List View</h2>
            <div className='ListViewItemWrapper' style={{justifyContent:'center'}}>
                <button className='btn btn-secondary m-1' onClick={refresh}>Refresh</button>
                <button className='btn btn-secondary m-1' onClick={() => {basicScheduler2()}}>Plan Events</button>
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