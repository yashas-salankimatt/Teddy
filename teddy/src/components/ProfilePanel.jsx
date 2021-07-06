import React, { useState, useContext } from 'react';
import './ProfilePanel.css';
import { UserContext } from '../providers/UserProvider';
import { firestore, signInWithGoogle, signOutWithGoogle } from "../utils/FirebaseConfig";

const testFunc = (user) => {
    if (user !== null) {
        const docLoc = "users/" + user.uid;
        const userRef = firestore.doc(docLoc);
        const { displayName, uid } = user;
        try {
            userRef.set({ displayName, uid });
            console.log("testLog");
        } catch (error) {
            console.error("error creating doc");
        }

    }
};

function ProfilePanel(props) {
    const user = useContext(UserContext);

    if (user !== null) {
        return (
            <div className='ProfilePanelWrapper'>
                <div>
                    <h4 className="GeneralButton">{user.displayName}</h4>
                </div>
                <div>
                    <button
                        onClick={() => testFunc(user)}
                        type="button"
                        className="GeneralButton btn btn-secondary"
                    >
                        Create doc for user
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