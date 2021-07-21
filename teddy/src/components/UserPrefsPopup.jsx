import React, { useEffect, useState } from 'react';
import './Popup.css'
import { auth, firestore } from '../utils/FirebaseConfig';

function UserPrefsPopup({trigger=false, setTrig}) {
    const [workDur, setWorkDur] = useState(0);
    const [calendars, setCalendars] = useState([]);
    const [calendarIDs, setCalendarIDs] = useState([]);
    const [workStart, setWorkStart] = useState();
    const [workEnd, setWorkEnd] = useState();

    const getPrefsData = async () => {
        const user = auth.currentUser;
        if (user !== null){
            try{
                const prefRef = firestore.collection("users").doc(user.uid).collection("prefs");
                const workPrefsDoc = await prefRef.doc("workPrefs").get();
                const calendarPrefsDocs = await prefRef.doc("calendarPrefs").get();
                setWorkDur(workPrefsDoc.data().prefDuration);
                setWorkStart(workPrefsDoc.data().workStart);
                setWorkEnd(workPrefsDoc.data().workEnd);
                setCalendarIDs(calendarPrefsDocs.data().calendarIDs);
            } catch (error) {
                console.log("Error when trying to get preferences from DB");
                console.log(error);
            }
            if (window.gapi.client.calendar){
                var response = await window.gapi.client.calendar.calendarList.list({});
                var tempCalendarItems = response.result.items;
                tempCalendarItems.forEach((calendar) => {
                    calendar.checked = false;
                    calendarIDs.forEach((calendarID) => {
                        if (calendarID === calendar.id){
                            calendar.checked = true;
                        }
                    });
                });
                setCalendars(tempCalendarItems);
            }
        }
    }

    useEffect(() => {
        getPrefsData();
    }, []);

    useEffect(() => {
        if (trigger){
            getPrefsData();
        }
    }, [trigger]);

    const handleChecked = (checked, calendarID) => {
        var tempCalendars;
        var tempCalendarIDs;
        if (checked) {
            tempCalendars = calendars.concat();
            tempCalendars.forEach((calendar) => {
                if (calendar.id === calendarID){
                    calendar.checked = true;
                }
            });
            setCalendars(tempCalendars);
            tempCalendarIDs = calendarIDs.concat();
            tempCalendarIDs.push(calendarID);
            setCalendarIDs(tempCalendarIDs);
        } else {
            tempCalendars = calendars.concat();
            tempCalendars.forEach((calendar) => {
                if (calendar.id === calendarID){
                    calendar.checked = false;
                }
            });
            setCalendars(tempCalendars);
            tempCalendarIDs = calendarIDs.concat();
            const findInd = tempCalendarIDs.findIndex((element) => {return element === calendarID});
            if (findInd >= 0){
                tempCalendarIDs.splice(findInd, 1);
            }
            setCalendarIDs(tempCalendarIDs);
        }
    };

    const updateDatabase = () => {
        const user = auth.currentUser;
        const prefRef = firestore.collection("users").doc(user.uid).collection("prefs");
        prefRef.doc("workPrefs").update({
            prefDuration: workDur,
            workEnd,
            workStart
        });
        prefRef.doc("calendarPrefs").update({
            calendarIDs
        });
        setTrig(false);
    }


    // TODO: When the popup is closed, the checkboxes don't automatically reload
    return (trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button className='close-btn btn btn-secondary' onClick={() => {setTrig(false)}}>Close</button>
                <h3>User Preferences</h3>
                <div className='EditableField'>
                    <h5 className='m-1'>Work Time Duration Preference: </h5>
                    <form>
                        <input className='form-control' type='number' onChange={(event) => {setWorkDur(event.target.value)}} value={workDur}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Work Start Time: </h5>
                    <form>
                        <input className='form-control timepicker' type='time' onChange={(event) => {setWorkStart(event.target.value)}} value={workStart}></input>
                    </form>
                </div>
                <div className='EditableField'>
                    <h5 className='m-1'>Work End Time: </h5>
                    <form>
                        <input className='form-control timepicker' type='time' onChange={(event) => {setWorkEnd(event.target.value)}} value={workEnd}></input>
                    </form>
                </div>
                <h5 className='m-1'>Calendars to Import: </h5>
                <div className='EditableField'>
                    <ul>
                        {calendars.map((calendar) => (
                            <div key={calendar.id} className='EditableField'>
                                <input className='form-check-input' type='checkbox' onChange={(event) => {handleChecked(event.target.checked, calendar.id)}} checked={calendar.checked}></input>
                                <h6 style={{marginLeft:'5px'}}>{calendar.summary}</h6>
                            </div>
                        ))}
                    </ul>
                </div>
                <button className='btn btn-secondary' onClick={() => {updateDatabase()}}>Save Changes</button>
            </div>            
        </div>
    ) : "";
}

export default UserPrefsPopup;