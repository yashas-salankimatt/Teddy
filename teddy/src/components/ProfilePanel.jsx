import React, { useState, useContext } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { fb, firestore, signInWithGoogle, signOutWithGoogle } from "../utils/FirebaseConfig";



function ProfilePanel(props) {
    const user = useContext(UserContext);

    if (user !== null) {
        return (
            <div className='ProfilePanelWrapper'>
                <div>
                    <h4 className="GeneralButton">{user.displayName}</h4>
                </div>
                {/* <div>
                    <button
                        onClick={() => createDoc(user)}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Create doc for user
                    </button>
                </div> */}
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