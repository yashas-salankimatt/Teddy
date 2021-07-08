import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCdCXBfkNdvHTZHnex5rj2t4kROUX1vYy0",
    authDomain: "teddy-318720.firebaseapp.com",
    projectId: "teddy-318720",
    storageBucket: "teddy-318720.appspot.com",
    messagingSenderId: "112181817782",
    appId: "1:112181817782:web:f52522acf47a9acc85d117",
    measurementId: "G-VHZFGZX8ZQ"
};

firebase.initializeApp(firebaseConfig);
export const fb = firebase;
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = (callback, user) => {
    auth.signInWithPopup(provider);
    auth.onAuthStateChanged(createDoc);
};

export const signOutWithGoogle = () => {
    auth.signOut();
};

const createDoc = async () => {
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
                const categoriesRef = userRef.collection("tasks").doc();
                categoriesRef.set({
                    categoryName: "DefaultCategory",
                    archived: true});
                const projectsRef = categoriesRef.collection("projects").doc();
                projectsRef.set({
                    projName: "DefaultProj",
                    completed: true,
                    decription: null,
                    dueDate: fb.firestore.Timestamp.fromDate(new Date('July 23, 2021'))
                });
                const tasksRef = projectsRef.collection("tasks").doc();
                tasksRef.set({
                    taskName: "DefaultTask",
                    completed: true,
                    description: null,
                    dueDate: fb.firestore.Timestamp.fromDate(new Date('July 22, 2021'))
                });
                const subtasksRef = tasksRef.collection('subtasks').doc();
                subtasksRef.set({
                    subtaskName: "DefaultSubtask",
                    completed: true,
                    description: null,
                    minutesNeeded: 600
                });
            } catch (error) {
                console.error("Error creating default doc for user");
            }
        }
    }
};