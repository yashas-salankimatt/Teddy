import { auth, firestore } from "../utils/FirebaseConfig";
import { getEvents } from '../components/CalendarWrapper';

var allSubtasks = [];

export const updateAllSubtasks = (setSubtasksCallback) => {
    try {
        if (auth.currentUser !== null){
            allSubtasks = [];
            const user = auth.currentUser;
            const userRef = firestore.collection("users").doc(user.uid);
            userRef.collection("todo").get().then((todoDocs) => {
                todoDocs.forEach((todoDoc) => {
                    todoDoc.ref.collection("projects").get().then((projectDocs) => {
                        projectDocs.forEach((projectDoc) => {
                            projectDoc.ref.collection("tasks").get().then((taskDocs) => {
                                taskDocs.forEach((taskDoc) => {
                                    taskDoc.ref.collection("subtasks").get().then((subtaskDocs) => {
                                        subtaskDocs.forEach((subtaskDoc) => {
                                            allSubtasks.push({
                                                categoryName: todoDoc.data().categoryName,
                                                projectName: projectDoc.data().projectName,
                                                taskName: taskDoc.data().taskName,
                                                dueDate: taskDoc.data().dueDate,
                                                subtaskName: subtaskDoc.data().subtaskName,
                                                minutesNeeded: subtaskDoc.data().minutesNeeded,
                                                completed: subtaskDoc.data().completed,
                                                description: subtaskDoc.data().description,
                                                path: subtaskDoc.ref.path,
                                                subtaskDoc: subtaskDoc.ref
                                            });
                                        });
                                        setSubtasksCallback(allSubtasks);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    } catch (error) {
        console.log("Error when trying to get all subtasks");
        console.log(error);
    }
};

export const addSubtasks = (subtaskArray) => {
    allSubtasks.push(subtaskArray);
    console.log(allSubtasks);
}

export const getAllSubtasks = () => {
    return allSubtasks;
}

export async function basicScheduler1() {
    console.log("running scheduler")
    const user = auth.currentUser;
    const prefDoc = await firestore.collection("users").doc(user.uid).collection("prefs").doc("workPrefs").get();
    const prefDuration = prefDoc.data().prefDuration;
    const workStartPref = prefDoc.data().workStart;
    const workEndPref = prefDoc.data().workEnd;
    const startDateTime = new Date(new Date().setDate(new Date().getDate() + 1));
    startDateTime.setHours(workStartPref.split(":")[0], workStartPref.split(":")[1], 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(workEndPref.split(":")[0], workEndPref.split(":")[1], 0, 0);
    var calendarEvents = await getEvents();
    
    var retEvents = [];
    allSubtasks.sort((a, b) => (a.dueDate.toMillis() > b.dueDate.toMillis()) ? 1 : -1);
    var currDateTime = new Date(startDateTime);
    calendarEvents = calendarEvents.filter((event) => (event.start.getTime() >= startDateTime.getTime()));
    // calendarEvents = calendarEvents.filter((event) => (event.end.getTime() <= endDateTime.getTime()));
    console.log({calendarEvents});
    for (let i = 0; i < allSubtasks.length; i++){
        var finishDateTime = new Date(currDateTime);
        finishDateTime.setMinutes(currDateTime.getMinutes()+allSubtasks[i].minutesNeeded);
        var findInd = calendarEvents.findIndex((event) => {
            return (event.start.getTime() < finishDateTime.getTime() && event.end.getTime() > finishDateTime.getTime())
        });
        if (findInd === -1) {
            retEvents.push({
                id: retEvents.length,
                title: allSubtasks[i].subtaskName,
                start: currDateTime,
                end: finishDateTime
            });
        }
        else {
            // this means that there is an event when the subtask would end
            // thus split the subtask
            var millisDiff = finishDateTime.getTime() - calendarEvents[findInd].start.getTime();
            retEvents.push({
                id: retEvents.length,
                title: allSubtasks[i].subtaskName,
                start: currDateTime,
                end: calendarEvents[findInd].start
            });
            finishDateTime = new Date(calendarEvents[findInd].end);
            finishDateTime.setTime(finishDateTime.getTime() + millisDiff + (15*60*1000));
            retEvents.push({
                id: retEvents.length,
                title: allSubtasks[i].subtaskName,
                start: calendarEvents[findInd].end,
                end: finishDateTime
            });
        }
        currDateTime = new Date(finishDateTime);
    }
    console.log(retEvents);
    return retEvents;
};


export async function basicScheduler2() {
    console.log("running scheduler")
    const user = auth.currentUser;
    const prefDoc = await firestore.collection("users").doc(user.uid).collection("prefs").doc("workPrefs").get();
    const timeQuantum = prefDoc.data().prefDuration;
    const workStartPref = prefDoc.data().workStart;
    const workEndPref = prefDoc.data().workEnd;
    const startDateTime = new Date(new Date().setDate(new Date().getDate() + 1));
    startDateTime.setHours(workStartPref.split(":")[0], workStartPref.split(":")[1], 0, 0);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(workEndPref.split(":")[0], workEndPref.split(":")[1], 0, 0);
    var calendarEvents = await getEvents();
    
    var retEvents = [];
    allSubtasks.sort((a, b) => (a.dueDate.toMillis() > b.dueDate.toMillis()) ? 1 : -1);
    console.log(allSubtasks);
    var remainingSubtasks = allSubtasks.concat();
    var workingDateTime = new Date(startDateTime);
    calendarEvents = calendarEvents.filter((event) => (event.start.getTime() >= startDateTime.getTime()));
    // calendarEvents = calendarEvents.filter((event) => (event.end.getTime() <= endDateTime.getTime()));
    console.log(allSubtasks);
    console.log({calendarEvents});
    console.log(remainingSubtasks);
    while (remainingSubtasks.length > 0){
        var startTimeInd = calendarEvents.findIndex((event) => {
            return (event.start.getTime() <= workingDateTime.getTime() && event.end.getTime() > workingDateTime.getTime())
        });
        if (startTimeInd !== -1){
            workingDateTime = new Date(calendarEvents[startTimeInd].end);
            continue;
        }
        var finishDateTime = new Date(workingDateTime);
        var timeWorked = 0;
        if (remainingSubtasks[0].minutesNeeded > timeQuantum){
            console.log(finishDateTime);
            finishDateTime.setMinutes(finishDateTime.getMinutes()+timeQuantum);
            console.log(finishDateTime);
            timeWorked = timeQuantum;
        } else {
            console.log(finishDateTime);
            console.log(finishDateTime.getMinutes(), remainingSubtasks[0].minutesNeeded);
            finishDateTime.setMinutes(finishDateTime.getMinutes()+parseInt(remainingSubtasks[0].minutesNeeded));
            console.log(finishDateTime);
            timeWorked = remainingSubtasks[0].minutesNeeded;
        }
        
        var findInd = calendarEvents.findIndex((event) => {
            return (event.start.getTime() < finishDateTime.getTime() && event.end.getTime() > finishDateTime.getTime())
        });
        if (findInd === -1) {
            retEvents.push({
                id: retEvents.length,
                title: remainingSubtasks[0].subtaskName,
                start: workingDateTime,
                end: finishDateTime
            });
            console.log(finishDateTime);
            console.log(timeWorked);
            console.log(retEvents);
            remainingSubtasks[0].minutesNeeded -= timeWorked;
            if (remainingSubtasks[0].minutesNeeded <= 0){
                remainingSubtasks.splice(0,1);
            }
        }
        else {  // there is a calendar event that interrupts plans
            var millisDiff = finishDateTime.getTime() - calendarEvents[findInd].start.getTime();
            retEvents.push({
                id: retEvents.length,
                title: remainingSubtasks[0].subtaskName,
                start: workingDateTime,
                end: calendarEvents[findInd].start
            });
            console.log(retEvents);
            remainingSubtasks[0].minutesNeeded -= millisDiff/60000;
            finishDateTime = calendarEvents[findInd].end;
        }
        workingDateTime = new Date(finishDateTime);
    }
    return retEvents;
};