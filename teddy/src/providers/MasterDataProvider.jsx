import { auth, firestore } from "../utils/FirebaseConfig";

var allSubtasks = [];

export const addSubtasks = (subtaskArray) => {
    allSubtasks.push(subtaskArray);
    console.log(allSubtasks);
}

export const getAllSubtasks = () => {
    // updateAllSubtasks2();
    // if (updateAllSubtasks2() === true){
    //     console.log("returned");
    //     return allSubtasks;
    // }
    return allSubtasks;
}