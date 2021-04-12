import React from 'react';

import firebase from 'firebase';
import {auth, firebaseApp} from "../app/firebase";
import {useAuthState} from "react-firebase-hooks/auth";


export const initializeFirebase = () => {
    firebase.initializeApp({
        messagingSenderId: '424660840094' // tvoj sender id
    }, "Slack-clone");

}

export const askForPermissioToReceiveNotifications = async () => {

    try {

        const messaging = firebase.messaging();

        await messaging.requestPermission();
        const token = await messaging.getToken();

        console.log('user token: ', token);

        return token;
    } catch (error) {
        console.error(error);
    }
}


