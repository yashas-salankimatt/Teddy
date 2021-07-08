import React, { useContext } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { signInWithGoogle, signOutWithGoogle } from "../utils/FirebaseConfig";
import {createCategory, getSubtaskDoc, getCatDoc, getProjDoc, getTaskDoc, createSubtask} from "../utils/FirestoreConfig";


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
                            // const doc = getTaskDoc({categoryName: "catTest", projectName: "defaultProj", taskName: "TestTask"});
                            // const doc = getTaskDoc({categoryID: "O6YY67zvqLii8gPTlZNX", projectID: "I5MqgqHeXuwmM4chmO1f", taskID: "LHyaf6MF2slWOSYR2uHv"});
                            const catDoc = createCategory({categoryName: "new category"});
                            const doc = getTaskDoc({catDoc, projectName: "defaultProj", taskName: "defaultTask"});
                            createSubtask({subtaskName: "TestSUbTask6", minutesNeeded: 700, taskDoc: doc});
                        }}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Create thing
                    </button>
                </div>
                <div>
                    <button
                        onClick={signOutWithGoogle}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Sign Out
                    </button>
                </div>
            </div >
        );
    }

    return (
        <div>
            <button
                onClick={signInWithGoogle}
                type="button"
                className="GeneralButton btn btn-secondary"
            >
                Sign In with Google
            </button>
        </div >
    );
}

export default ProfilePanel;