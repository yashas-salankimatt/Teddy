import React, { useContext } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { fb} from "../utils/FirebaseConfig";
import {createCategory, createProject, createTask} from "../utils/TaskDBConfig";
import { overallLogout, overallLogin} from '../utils/GCalAuthProvider';
import { getEvents, getCalendarIds } from '../utils/CalendarWrapper';

function ProfilePanel (props) {
    const user = useContext(UserContext);

    if (user !== null) {
        return (
            <div className='ProfilePanelWrapper'>
                <div>
                    <h4 className="GeneralButton">{user.displayName}</h4>
                </div>
                <div>
                    <button
                        onClick={async () => {
                           for (let i = 1; i <= 2; i++){
                               var categoryName = "Class " + i;
                               const catDoc = createCategory({categoryName});
                                for (let j = 1; j <= 3; j++){
                                    const projectName = "Assignment " + j;
                                    const dateStr = "July " + (i*10 + j) + ", 2021";
                                    const projDoc = createProject({
                                        projectName,
                                        dueDate: fb.firestore.Timestamp.fromDate(new Date(dateStr)),
                                        catDoc
                                    });
                                    for (let k = 1; k <= 3; k++){
                                        const taskName = "Task " + k;
                                        const dateStr = "July" + (i*10 + j-4) + ", 2021";
                                        const minutesNeeded = k * 30;

                                        const taskDoc = createTask({
                                            taskName,
                                            dueDate: fb.firestore.Timestamp.fromDate(new Date(dateStr)),
                                            projDoc,
                                            minutesNeeded
                                        });
                                    }
                                }
                           }
                        }}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Create temp data
                    </button>
                </div>
                <div>
                    <button
                        onClick={overallLogout}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Sign Out
                    </button>
                </div>
                <div>
                    <button
                        onClick={getEvents}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        get events
                    </button>
                </div>
                {/* <GCalAuthProvider></GCalAuthProvider> */}
            </div >
        );
    }

    return (
        <div>
            <button
                onClick={overallLogin}
                type="button"
                className="GeneralButton btn btn-secondary"
            >
                Sign In with Google
            </button>
            {/* <GCalAuthProvider></GCalAuthProvider> */}
        </div >
    );
}

export default ProfilePanel;