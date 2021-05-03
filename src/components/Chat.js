import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined"
import InfoOutlineIcon from "@material-ui/icons/InfoOutlined"
import {useDispatch, useSelector} from "react-redux";
import {selectRoomId} from "../features/appSlice";
import ChatInput from "./ChatInput";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {auth, db} from "../app/firebase";
import Message from "./Message";
import {useAuthState} from "react-firebase-hooks/auth";
import Spinner from "react-spinkit";
import MyMessage from "./MyMessage";
import {showBadge} from "../features/firestoreSlice";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import TextInput from "./Test Environment/TextInput";


function Chat(props) {
    const dispatch = useDispatch();
    const chatRef = useRef(null);
    let roomId = useSelector(selectRoomId)
    const [renderMessage, setRenderMessages] = useState([])
    let [roomDetails] = useDocument(
        roomId && db.collection('rooms').doc(roomId)
    );
    const [roomMessages, loading] = useCollection(
        roomId && db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );
    const [userID] = useAuthState(auth);
    const loggedInUser = userID.uid
    const [currentUser, setCurrentUser] = useState('')
    const messagesRef =  roomId && db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')

    const [toggleRoomDetails, setToggleRoomDetails] = useState(false)
    //const [currentUser, setCurrentUser] = useState("")
    const markReadRef = roomId && db.collection("rooms").doc(roomId).collection("messages")
        .where("reads", "array-contains", loggedInUser)
    const filterMessagesRef = roomId && db.collection("rooms").doc(roomId).collection("messages")




    let lastSenderId = undefined



    useEffect(() => {




        chatRef?.current?.scrollIntoView({
            behavior:'smooth',

        });
        if (loading){
            return (
                <AppLoading>
                    <AppLoadingContents>
                        <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" alt=""/>
                        <Spinner
                            name="ball-spin-fade-loader"
                            color="purple"
                            fadeIn="none"
                        />
                    </AppLoadingContents>
                </AppLoading>

            )
        }



    }, [roomId, loading]);

    dispatch(showBadge({
        hideBadge: roomDetails?.id,

    }))

    return (
        <ChatContainer>
            {roomDetails && roomMessages && (
                <>
                    <Header>
                        <HeaderLeft>
                            <h4><strong>#{roomDetails?.data().name}</strong></h4>
                            <StarBorderOutlinedIcon/>

                        </HeaderLeft>
                        <HeaderRight>
                            <p>
                                <InfoOutlineIcon/>
                                Details
                            </p>

                        </HeaderRight>
                    </Header>
                    <ChatMessages>

                        {roomMessages?.docs.map((doc, index) => {

                            const {message, timestamp, user, userImage, user_id} = doc.data();

                            //setRenderMessages(doc.data())

                            let showName = !lastSenderId || user_id !== lastSenderId;
                            lastSenderId = user_id;

                            return (

                                <Message
                                    key={doc.id}
                                    showName={showName}
                                    message={message}
                                    user_name={user}
                                    docId={doc.id}
                                    user={user}
                                    userImage={userImage}
                                    timestamp={timestamp}

                                />
                            )



                        })}



                        <ChatBottom ref={chatRef}/>
                    </ChatMessages>
                    <ChatInput
                        chatRef={chatRef}
                        channelName={roomDetails?.data().name}
                        channelId={roomId}
                    />
                </>
            )}

        </ChatContainer>
    );
}

export default Chat;

const ChatContainer = styled.div`
  flex: .7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 60px;
  background: whitesmoke;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`
const HeaderLeft = styled.div`
display: flex;
align-items: center;
  >h4{
  display: flex;
  text-transform: lowercase;
  margin-right: 10px;
  }
  >h4 >.MuiSvgIcon-root{
  margin-left: 10px;
  font-size: 18px;
  }
`
const HeaderRight = styled.div`
  >p{
  display: flex;
  align-items: center;
  font-size: 16px;
  
  
  }
  >p > .MuiSvgIcon-root{
  margin-right: 5px; !important;
  font-size: 16px;
  }
  
`
const ChatMessages = styled.div`
  
`
const ChatBottom = styled.div`
  padding-bottom: 200px;
`

const AppLoadingContents = styled.div`
  text-align: center;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  >img{
  height: 100px;
  padding: 20px;
  margin-bottom: 40px;
  }
`
const AppLoading = styled.div`
display: grid;
place-items: center;
height: 100vh;
width: 100%;

`

