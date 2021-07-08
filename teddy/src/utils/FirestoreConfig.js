import { fb, auth, firestore } from "./FirebaseConfig";

export const createDefaultDoc = async () => { 
    const user = auth.currentUser;
    console.log("Testing to see if user doc needs to be created");
    if (user !== null) {
        const { displayName, uid, email } = user;
        const userRef = firestore.collection("users").doc(uid);
        const doc = await userRef.get();
        if (!doc.exists){
            try {
                console.log("Attempting to create user doc since none exists");
                userRef.set({displayName, email, uid});
                createCategory({
                    categoryName:"defaultCat", 
                    archived:true, 
                    defaultCat:true
                });
            } catch (error) {
                console.error("Error creating default doc for user");
            }
        }
    }
};

// ============================== creation methods ==========================

export const createCategory = ({categoryName, archived=false, defaultCat=false}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const categoriesRef = userRef.collection("todo").doc();
        categoriesRef.set({
            categoryName, archived, defaultCat
        });
        // console.log(categoriesRef.id);
        createProject({
            projectName:"defaultProj", 
            completed: true,
            // dueDate: fb.firestore.Timestamp.fromDate(new Date('July 23, 2021')),
            dueDate: null,
            catID: categoriesRef.id,
            defaultProj:true
        });
        return categoriesRef.id;
    } catch(error) {
        console.log("Error in trying to create category");
        console.log(error);
    }
    return null;
};

export const createProject = ({projectName, dueDate, catID, description=null, completed=false, defaultProj=false}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const categoriesRef = userRef.collection("todo").doc(catID);
        const projectsRef = categoriesRef.collection("projects").doc();
        projectsRef.set({
            projectName, completed, defaultProj, dueDate, description
        });
        // console.log(projectsRef.id); 
        createTask({
            taskName: "defaultTask",
            completed: true,
            // dueDate: fb.firestore.Timestamp.fromDate(new Date('July 22, 2021')),
            dueDate: null,
            catID: catID,
            projID: projectsRef.id,
            defaultTask:true
        });
        return projectsRef.id;
    } catch(error) {
        console.log("Error in trying to create project");
        console.log(error);
    }
    return null;
};

export const createTask = ({taskName, dueDate, catID, projID, description=null, completed=false, defaultTask=false}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const categoriesRef = userRef.collection("todo").doc(catID);
        const projectsRef = categoriesRef.collection("projects").doc(projID);
        const tasksRef = projectsRef.collection("tasks").doc();
        tasksRef.set({
            taskName, completed, defaultTask, dueDate, description
        });
        // console.log(tasksRef.id);
        createSubtask({
            subtaskName: "defaultSubtask",
            completed: true,
            minutesNeeded: 0,
            defaultSubtask: true,
            catID: catID,
            projID: projID,
            taskID: tasksRef.id
        });
        return tasksRef.id;
    } catch(error) {
        console.log("Error in trying to create task");
        console.log(error);
    }
    return null;
};

export const createSubtask = ({subtaskName, minutesNeeded, catID=null, projID=null, taskID=null, description=null, completed=false, defaultSubtask=false}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const categoriesRef = userRef.collection("todo").doc(catID);
        const projectsRef = categoriesRef.collection("projects").doc(projID);
        const tasksRef = projectsRef.collection("tasks").doc(taskID);
        const subtasksRef = tasksRef.collection("subtasks").doc();
        subtasksRef.set({
            subtaskName, completed, defaultSubtask, minutesNeeded, description
        });
        // console.log(subtasksRef.id);
        return subtasksRef.id;
    } catch(error) {
        console.log("Error in trying to create subtask");
        console.log(error);
    }
    return null;
};

// ============================= getter methods ==============================

export const getCatDoc = async ({categoryName}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const snapshot = await userRef.collection("todo").where('categoryName', '==', categoryName).get();
        if (snapshot.empty) {
            console.log('No matching categories');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one category of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        console.log(retRef.id);
        return retRef;
    } catch(error) {
        console.log("Error in trying to get category ID");
        console.log(error);
    }
    return null;
};

export const getProjDoc = async ({catDoc=null, categoryName=null, projectName}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    }
    catDoc = await catDoc;

    try{
        // const userRef = firestore.collection("users").doc(user.uid);
        const snapshot = await catDoc.collection("projects").where('projectName', '==', projectName).get();
        if (snapshot.empty) {
            console.log('No matching projects');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one project of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        console.log(retRef.id);
        return retRef;
    } catch(error) {
        console.log("Error in trying to get project ID");
        console.log(error);
    }
    return null;
};

export const getTaskDoc = async ({catDoc=null, categoryName=null, projDoc=null, projectName=null, taskName}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    }
    catDoc = await catDoc;

    if (projectName && !projDoc){
        projDoc = await getProjDoc({catDoc, projectName});
    }
    projDoc = await projDoc;

    try{
        const snapshot = await projDoc.collection("tasks").where('taskName', '==', taskName).get();
        if (snapshot.empty) {
            console.log('No matching tasks');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one task of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        console.log(retRef.id);
        return retRef;
    } catch(error) {
        console.log("Error in trying to get task ID");
        console.log(error);
    }
    return null;
};

export const getSubtaskDoc = async ({catDoc=null, categoryName=null, projDoc=null, projectName=null, taskDoc=null, taskName=null, subtaskName}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    }
    catDoc = await catDoc;

    if (projectName && !projDoc){
        projDoc = await getProjDoc({catDoc, projectName});
    }
    projDoc = await projDoc;

    if (taskName && !taskDoc){
        taskDoc = await getTaskDoc({catDoc, projDoc, taskName});
    }
    taskDoc = await taskDoc;

    try{
        const snapshot = await taskDoc.collection("subtasks").where('subtaskName', '==', subtaskName).get();
        if (snapshot.empty) {
            console.log('No matching tasks');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one task of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        console.log(retRef.id);
        return retRef;
    } catch(error) {
        console.log("Error in trying to get task ID");
        console.log(error);
    }
    return null;
};