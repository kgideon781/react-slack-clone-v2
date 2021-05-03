// eslint-disable-next-line no-unused-vars
import React from 'react';

import firebase from 'firebase';

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


