import React, { useContext } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { signInWithGoogle, signOutWithGoogle } from "../utils/FirebaseConfig";
import {createCategory, getSubtaskDoc, getCatDoc, getProjDoc, getTaskDoc} from "../utils/FirestoreConfig";


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
                        onClick={() => getSubtaskDoc({
                            categoryName: "defaultCat",
                            projectName: "defaultProj",
                            taskName: "defaultTask",
                            subtaskName: "defaultSubtask"
                        })}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Get ID
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