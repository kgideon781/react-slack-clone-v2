import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAFCE9Ud_XzrviWx7XgixT_si0Bv62itEc",
    authDomain: "slack-clone-bc2d5.firebaseapp.com",
    projectId: "slack-clone-bc2d5",
    storageBucket: "slack-clone-bc2d5.appspot.com",
    messagingSenderId: "424660840094",
    appId: "1:424660840094:web:5a2cabab346c631fcf558f"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider, db};