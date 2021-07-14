import { auth, firestore } from "./FirebaseConfig";

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
            } catch (error) {
                console.error("Error creating default doc for user");
            }
        }
    }
};

// ============================== creation methods ==========================

export const createCategory = ({categoryName, archived=false}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        const categoriesRef = userRef.collection("todo").doc();
        categoriesRef.set({
            categoryName, archived
        });
        return categoriesRef;
    } catch(error) {
        console.log("Error in trying to create category");
        console.log(error);
    }
    return null;
};

export const createProject = async ({projectName, dueDate, catDoc, description=null, completed=false}) => {
    catDoc = await catDoc;
    try{
        const projectsRef = catDoc.collection("projects").doc();
        projectsRef.set({
            projectName, completed, dueDate, description
        });
        return projectsRef;
    } catch(error) {
        console.log("Error in trying to create project");
        console.log(error);
    }
    return null;
};

export const createTask = async ({taskName, dueDate, projDoc, minutesNeeded=null, description=null, completed=false}) => {
    projDoc = await projDoc;
    try{
        const tasksRef = projDoc.collection("tasks").doc();
        tasksRef.set({
            taskName, completed, dueDate, description
        });
        if (minutesNeeded){
            createSubtask({
                subtaskName: taskName + " - General",
                minutesNeeded,
                taskDoc: tasksRef
            });
        }
        return tasksRef;
    } catch(error) {
        console.log("Error in trying to create task");
        console.log(error);
    }
    return null;
};

export const createSubtask = async ({subtaskName, minutesNeeded, taskDoc, description=null, completed=false}) => {
    taskDoc = await taskDoc;
    try{
        const subtasksRef = taskDoc.collection("subtasks").doc();
        subtasksRef.set({
            subtaskName, completed, minutesNeeded, description
        });
        return subtasksRef;
    } catch(error) {
        console.log("Error in trying to create subtask");
        console.log(error);
    }
    return null;
};

// ============================= getter methods ==============================

export const getCatDoc = async ({categoryName=null, categoryID=null}) => {
    const user = auth.currentUser;
    try{
        const userRef = firestore.collection("users").doc(user.uid);
        var snapshot = null;
        if (categoryName && !categoryID){
            snapshot = await userRef.collection("todo").where('categoryName', '==', categoryName).get();
        } else {
            var retDoc = await userRef.collection("todo").doc(categoryID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching categories');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one category of this name');
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get category doc");
        console.log(error);
    }
    return null;
};

export const getProjDoc = async ({catDoc=null, categoryName=null, categoryID=null, projectName=null, projectID=null}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    } else if (categoryID && !catDoc){
        catDoc = await getCatDoc({categoryID});
    }
    catDoc = await catDoc;

    try{
        var snapshot = null;
        if (projectName && !projectID){
            snapshot = await catDoc.collection("projects").where('projectName', '==', projectName).get();
        } else {
            var retDoc = await catDoc.collection("projects").doc(projectID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching projects');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one project of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get project ID");
        console.log(error);
    }
    return null;
};

export const getTaskDoc = async ({catDoc=null, categoryName=null, categoryID=null, projDoc=null, projectName=null, projectID=null, taskName=null, taskID=null}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    } else if (categoryID && !catDoc){
        catDoc = await getCatDoc({categoryID});
    }
    catDoc = await catDoc;

    if (projectName && !projDoc){
        projDoc = await getProjDoc({catDoc, projectName});
    } else if (projectID && !projDoc){
        projDoc = await getProjDoc({catDoc, projectID});
    }
    projDoc = await projDoc;

    try{
        var snapshot = null;
        if (taskName && !taskID){
            snapshot = await projDoc.collection("tasks").where('taskName', '==', taskName).get();
        } else {
            var retDoc = await projDoc.collection("tasks").doc(taskID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching tasks');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one task of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        return retRef;
    } catch(error) {
        console.log("Error in trying to get task ID");
        console.log(error);
    }
    return null;
};

export const getSubtaskDoc = async ({catDoc=null, categoryName=null, categoryID=null, projDoc=null, projectName=null, projectID=null, taskDoc=null, taskName=null, taskID=null, subtaskName=null, subtaskID=null}) => {
    if (categoryName && !catDoc){
        catDoc = await getCatDoc({categoryName});
    } else if (categoryID && !catDoc){
        catDoc = await getCatDoc({categoryID});
    }
    catDoc = await catDoc;

    if (projectName && !projDoc){
        projDoc = await getProjDoc({catDoc, projectName});
    } else if (projectID && !projDoc){
        projDoc = await getProjDoc({catDoc, projectID});
    }
    projDoc = await projDoc;

    if (taskName && !taskDoc){
        taskDoc = await getTaskDoc({catDoc, projDoc, taskName});
    } else if (taskID && !taskDoc) {
        taskDoc = await getTaskDoc({catDoc, projDoc, taskID});
    }
    taskDoc = await taskDoc;

    try{
        var snapshot = null;
        if (subtaskName && !subtaskID){
            snapshot = await taskDoc.collection("subtasks").where('subtaskName', '==', subtaskName).get();
        } else {
            var retDoc = await taskDoc.collection("subtasks").doc(subtaskID);
            retDoc = await retDoc;
            return retDoc;
        }
        if (snapshot.empty) {
            console.log('No matching subtasks');
            return null;
        }
        if (snapshot.size > 1){
            console.log('More than one subtask of this name');
            return null;
        }
        const retRef = await snapshot.docs[0].ref;
        console.log(retRef.id);
        return retRef;
    } catch(error) {
        console.log("Error in trying to get subtask ID");
        console.log(error);
    }
    return null;
};



export const deleteCategory = async ({categoryName=null, categoryID=null}) => {
    try{
        var retID = null;
        getCatDoc({categoryName, categoryID}).then((catDoc) => {
            retID = catDoc.id;
            catDoc.collection("projects").get().then((projectsDocs) => {
                if (projectsDocs.empty){
                    // break;
                } else {
                    projectsDocs.forEach((projectDoc) => {
                        projectDoc.ref.collection("tasks").get().then((tasksDocs) => {
                            if (tasksDocs.empty){
                                // break;
                            } else {
                                tasksDocs.forEach((taskDoc) => {
                                    taskDoc.ref.collection("subtasks").get().then((subtaskDocs) => {
                                        if (subtaskDocs.empty){
                                            // break;
                                        } else {
                                            subtaskDocs.forEach((subtaskDoc) => {
                                                subtaskDoc.ref.delete();
                                            });
                                        }
                                    });
                                    taskDoc.ref.delete();
                                });
                            }
                        });
                        projectDoc.ref.delete();
                    });
                }
            });
            catDoc.delete();
        });
        return retID;
    } catch(error) {
        console.log("Error in trying to delete category");
        console.log(error);
    }
    return null;
};


export const deleteProject = async ({catDoc, projectName=null, projectID=null}) => {
    try{
        catDoc = await catDoc;
        var retID = null;
        getProjDoc({catDoc, projectName, projectID}).then((projDoc) => {
            retID = projDoc.id;
            projDoc.collection("tasks").get().then((tasksDocs) => {
                if (tasksDocs.empty){
                    // break;
                } else {
                    tasksDocs.forEach((taskDoc) => {
                        taskDoc.ref.collection("subtasks").get().then((subtaskDocs) => {
                            if (subtaskDocs.empty){
                                // break;
                            } else {
                                subtaskDocs.forEach((subtaskDoc) => {
                                    subtaskDoc.ref.delete();
                                });
                            }
                        });
                        taskDoc.ref.delete();
                    });
                }
            });
            projDoc.delete();
        });
        return retID;
    } catch(error) {
        console.log("Error in trying to delete project");
        console.log(error);
    }
    return null;
};


export const deleteTask = async({projDoc, taskName=null, taskID=null}) => {
    try{
        projDoc = await projDoc;
        var retID = null;
        getTaskDoc({projDoc, taskName, taskID}).then((taskDoc) => {
            retID = taskDoc.id;
            taskDoc.collection("subtasks").get().then((subtaskDocs) => {
                if (subtaskDocs.empty){
                    // break;
                } else {
                    subtaskDocs.forEach((subtaskDoc) => {
                        subtaskDoc.ref.delete();
                    });
                }
            });
            taskDoc.delete();
        });
        return retID;
    }catch (error) {
        console.log("Error in trying to delete task");
        console.log(error);
    }
    return null;
};


export const deleteSubtask = async ({taskDoc, subtaskName=null, subtaskID=null}) => {
    try {
        taskDoc = await taskDoc;
        var retID = null;
        getSubtaskDoc({taskDoc, subtaskName, subtaskID}).then((subtaskDoc) => {
            retID = subtaskDoc.id;
            subtaskDoc.delete();
        });
        return retID;
    } catch (error) {
        console.log("Error in trying to delete subtask");
        console.log(error);
    }
    return null;
};