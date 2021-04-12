import React, {useState} from 'react';
import styled from "styled-components";
import TestArea from "./TestArea";
import {useCollection} from "react-firebase-hooks/firestore";
import {db} from "../app/firebase";
import {useSelector} from "react-redux";
import {selectRoomId} from "../features/appSlice";

function ChatEngine(props) {
    const roomId = useSelector(selectRoomId)
    const [messages, setMessages] = useState([])
    const [roomMessages, loading] = useCollection(
        '2ATXydVpGG7nsudrYDyX' && db.collection('rooms')
            .doc('2ATXydVpGG7nsudrYDyX')
            .collection('messages')
            .orderBy('timestamp', 'asc'))
    roomMessages?.docs.map((doc) => {
        setMessages(doc.get('user_id'))
    })
    return (
        <ChatsEngine
        renderChatFeed={()=><TestArea messages/>}
        />
    );
}

export default ChatEngine;

const ChatsEngine = styled.div`
  height: 100vh;
  
`

