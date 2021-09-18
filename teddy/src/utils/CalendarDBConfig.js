import { auth, firestore } from "./FirebaseConfig";

// ============================== creation methods ==========================

export const createEvent = async ({calendarId, eventName, plannedStartTime, plannedEndTime, workingStartTime, workingEndTime, isTodo, hexColor}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const res = await userRef.collection("calendar").add({
            calendarId, eventName, plannedStartTime, plannedEndTime, workingStartTime, workingEndTime, isTodo, hexColor
        });
        console.log(res.id);
        return res.id;
    } catch(error) {
        console.log("Error in trying to create event");
        console.log(error);
    }
    return null;
};

// ============================= getter methods ==============================

export const getEventDoc = async ({eventID=null, eventName=null}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        var snapshot = null;
        if (eventName && !eventID){
            snapshot = await userRef.collection("calendar").where('eventName', '==', eventName).get();
        } else {
            var retDoc = await userRef.collection("calendar").doc(eventID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching events');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one event of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get event ID");
        console.log(error);
    }
    return null;
};

//Delete functions

export const deleteEvent = async ({eventName=null, eventID=null}) => {
    try {
        var retID = null;
        getEventDoc({eventName, eventID}).then((eventDoc) => {
            retID = eventDoc.id;
            eventDoc.delete();
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to delete planned event");
        console.log(error);
    }
    return null;
};

export const updateEvent = async ({eventName=null, eventID=null, event}) => {
    try {
        var retID = null;
        getEventDoc({eventName, eventID}).then((eventDoc) => {
            retID = eventDoc.id;
            const updateEventData = {
                calendarId: event.calendarId,
                eventName: event.title,
                plannedStartTime: event.plannedstart,
                plannedEndTime: event.plannedend, 
                workingStartTime: event.start,
                workingEndTime: event.end,
                isTodo: event.isTodo,
                hexColor: event.hexColor
            };
            eventDoc.update(updateEventData);
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to update event");
        console.log(error);
    }
    return null;
};