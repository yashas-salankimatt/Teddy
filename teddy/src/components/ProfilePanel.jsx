import React, { useContext, useState } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { fb} from "../utils/FirebaseConfig";
import {createCategory, createProject, createTask} from "../utils/TaskDBConfig";
import {overallLogout, overallLogin} from '../utils/GCalAuthProvider';
import { Dropdown} from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';
import UserPrefsPopup from './UserPrefsPopup';

function ProfilePanel (props) {
    const user = useContext(UserContext);
    const [showPrefsPopup, setShowPrefsPopup] = useState(false);

    const CreateTempData = async() => {
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
    }

    if (user !== null) {
        return (
            <div className='ProfilePanelWrapper'>
                <h4 className="General">{user.displayName}</h4>
                <Dropdown className="ProfilePhoto">
                    <DropdownToggle variant="secondary">
                        <img className="ProfilePhoto" src={user.photoURL} alt=""></img>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {setShowPrefsPopup(true)}}>User Preferences</DropdownItem>
                        <DropdownItem onClick={overallLogout}>Sign Out</DropdownItem>
                        <DropdownItem onClick={CreateTempData}>Create temp data</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <UserPrefsPopup trigger={showPrefsPopup} setTrig={setShowPrefsPopup}></UserPrefsPopup>
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