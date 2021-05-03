import React, {useEffect, useRef, useState} from 'react';
import TextInput from "./Test Environment/TextInput";
import {askForPermissioToReceiveNotifications} from "./MyMessage";
import Button from "reactstrap/es/Button";


function TestArea(props) {



    return (
        <>
        <TextInput/>

            <Button onClick={askForPermissioToReceiveNotifications}>Ask for Permission</Button>

        </>
    )


}
export default TestArea;


