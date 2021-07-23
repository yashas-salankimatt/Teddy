import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {createDefaultDoc} from "./TaskDBConfig"

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
export const signInWithGoogle = (callback) => {
    auth.signInWithPopup(provider);
    auth.onAuthStateChanged(createDefaultDoc);
};

export const signOutWithGoogle = () => {
    auth.signOut();
};