import React, {useEffect, useRef, useState} from 'react';
import TextInput from "./Test Environment/TextInput";
import {askForPermissioToReceiveNotifications} from "./MyMessage";
import Button from "reactstrap/es/Button";
import {auth, db} from "../app/firebase";
import {useSelector} from "react-redux";
import {selectRoomId} from "../features/appSlice";
import {useAuthState} from "react-firebase-hooks/auth";

function TestArea(props) {
    const roomId = useSelector(selectRoomId)
    const [userID] = useAuthState(auth);


    return (
        <>
        <TextInput/>

            <Button onClick={askForPermissioToReceiveNotifications}>Ask for Permission</Button>

        </>
    )


}
export default TestArea;


