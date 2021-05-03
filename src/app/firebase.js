import firebase from "firebase";


const firebaseConfig = {
    apiKey: "AIzaSyCdBUCpfRYbKdyeZGgFxgIOmnxaKEFGlZw",
    authDomain: "slack-clone-e9de6.firebaseapp.com",
    projectId: "slack-clone-e9de6",
    storageBucket: "slack-clone-e9de6.appspot.com",
    messagingSenderId: "482454076956",
    appId: "1:482454076956:web:975809c3b0d0b21a9269d9"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider, db};