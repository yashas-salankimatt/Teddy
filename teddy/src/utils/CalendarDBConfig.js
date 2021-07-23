import { auth, firestore } from "./FirebaseConfig";

// ============================== creation methods ==========================

export const createDate = async ({dateID, day, month, year}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const datesRef = userRef.collection("calendar").doc(dateID);
        const doc = await datesRef.get();

        if (doc.exists) {
            console.log('Document already exists');
            return datesRef;
        }

        datesRef.set({
            day, month, year
        });
        return datesRef;
    } catch(error) {
        console.log("Error in trying to create date");
        console.log(error);
    }
    return null;
};

export const createPlanned = async ({eventName, startTime, endTime, dateDoc}) => {
    dateDoc = await dateDoc;
    try{
        const plannedRef = dateDoc.collection("planned").doc();
        plannedRef.set({
            eventName, startTime, endTime
        });
        return plannedRef;
    } catch(error) {
        console.log("Error in trying to create planned calendar");
        console.log(error);
    }
    return null;
};

export const createWorking = async ({eventName, startTime, endTime, dateDoc}) => {
    dateDoc = await dateDoc;
    try{
        const workingRef = dateDoc.collection("working").doc();
        workingRef.set({
            eventName, startTime, endTime
        });
        return workingRef;
    } catch(error) {
        console.log("Error in trying to create working calendar");
        console.log(error);
    }
    return null;
};

// ============================= getter methods ==============================

export const getDateDoc = async ({dateID=null}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        var snapshot = null;
        
        var retDoc = await userRef.collection("calendar").doc(dateID);
        retDoc = await retDoc;
        return retDoc;
        
        if (snapshot.empty) {
            console.log('No matching dates');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one date of this name');
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get date doc");
        console.log(error);
    }
    return null;
};

export const getPlannedDoc = async ({dateDoc=null, dateID=null, eventName=null, plannedID=null}) => {
    if (dateID && !dateDoc){
        dateDoc = await getDateDoc({dateID});
    }
    dateDoc = await dateDoc;

    try{
        var snapshot = null;
        if (eventName && !plannedID){
            snapshot = await dateDoc.collection("planned").where('eventName', '==', eventName).get();
        } else {
            var retDoc = await dateDoc.collection("planned").doc(plannedID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching planned events');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one planned event of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get planned event ID");
        console.log(error);
    }
    return null;
};

export const getWorkingDoc = async ({dateDoc=null, dateID=null, eventName=null, workingID=null}) => {
    if (dateID && !dateDoc){
        dateDoc = await getDateDoc({dateID});
    }
    dateDoc = await dateDoc;

    try{
        var snapshot = null;
        if (eventName && !workingID){
            snapshot = await dateDoc.collection("working").where('eventName', '==', eventName).get();
        } else {
            var retDoc = await dateDoc.collection("working").doc(workingID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching working events');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one working event of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get working event ID");
        console.log(error);
    }
    return null;
};

//Delete functions

export const deleteDate = async ({dateID=null}) => {
    try{
        var retID = null;
        getDateDoc({dateID}).then((dateDoc) => {
            retID = dateDoc.id;
            dateDoc.collection("planned").get().then((plannedDocs) => {
                if (plannedDocs.empty){
                    // break;
                } else {
                    plannedDocs.forEach((plannedDoc) => {
                        plannedDoc.ref.delete();
                    });
                }
            });
            dateDoc.collection("working").get().then((workingDocs) => {
                if (workingDocs.empty){
                    // break;
                } else {
                    workingDocs.forEach((workingDoc) => {
                        workingDoc.ref.delete();
                    });
                }
            });
            dateDoc.delete();
        });
        return retID;
    } catch(error) {
        console.log("Error in trying to delete date");
        console.log(error);
    }
    return null;
};

export const deletePlanned = async ({dateDoc, eventName=null, plannedID=null}) => {
    try {
        dateDoc = await dateDoc;
        var retID = null;
        getPlannedDoc({dateDoc, eventName, plannedID}).then((plannedDoc) => {
            retID = plannedDoc.id;
            plannedDoc.delete();
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to delete planned event");
        console.log(error);
    }
    return null;
};

export const deleteWorking = async ({dateDoc, eventName=null, workingID=null}) => {
    try {
        dateDoc = await dateDoc;
        var retID = null;
        getWorkingDoc({dateDoc, eventName, workingID}).then((workingDoc) => {
            retID = workingDoc.id;
            workingDoc.delete();
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to delete working event");
        console.log(error);
    }
    return null;
};

export const updatePlanned = async ({dateDoc, eventName=null, plannedID=null, event}) => {
    try {
        dateDoc = await dateDoc;
        var retID = null;
        getPlannedDoc({dateDoc, eventName, plannedID}).then((plannedDoc) => {
            retID = plannedDoc.id;
            const updatePlannedData = {
                eventName: event.title,
                startTime: event.start,
                endTime: event.end, 
            };
            plannedDoc.update(updatePlannedData);
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to update planned event");
        console.log(error);
    }
    return null;
};

export const updateWorking = async ({dateDoc, eventName=null, workingID=null, event}) => {
    try {
        dateDoc = await dateDoc;
        var retID = null;
        getWorkingDoc({dateDoc, eventName, workingID}).then((workingDoc) => {
            retID = workingDoc.id;
            const updateWorkingData = {
                eventName: event.title,
                startTime: event.start,
                endTime: event.end, 
            };
            workingDoc.update(updateWorkingData);
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to update working event");
        console.log(error);
    }
    return null;
};