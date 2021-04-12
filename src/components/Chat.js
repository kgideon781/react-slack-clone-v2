import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined"
import InfoOutlineIcon from "@material-ui/icons/InfoOutlined"
import {useSelector} from "react-redux";
import {selectRoomId} from "../features/appSlice";
import ChatInput from "./ChatInput";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import {auth, db} from "../app/firebase";
import Message from "./Message";
import {useAuthState} from "react-firebase-hooks/auth";
import Spinner from "react-spinkit";
import MyMessage from "./MyMessage";


function Chat(props) {
    const chatRef = useRef(null);
    const roomId = useSelector(selectRoomId)
    const [renderMessage, setRenderMessages] = useState([])
    const [roomDetails] = useDocument(
        roomId && db.collection('rooms').doc(roomId)
    );
    const [roomMessages, loading] = useCollection(
        roomId && db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );
    const [userID] = useAuthState(auth);
    const messagesRef =  roomId && db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')


         const allMessagesRef = roomId && db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc');



    //console.log(roomMessages)
    console.log(roomId)



    /*messagesRef?.get().then((docus) => {
        docus.docs.map((doc) => {
            //console.log(doc.data())
            renderMessage.push({
                id:doc.get('user_id'),
                message: doc.get('message'),
                user_name: doc.get('user')
            })
            setRenderMessages(renderMessage)
            //console.log(renderMessage)
        })
    })*/
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
    let allMsg = [];


    //console.log(roomId)
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
{/*







                        {roomMessages?.docs.map((doc, index) => {
                            const documetID = doc.id;

                            renderMessage.map((message, indice) => {
                                let showName = !lastSenderId || message.id !== lastSenderId;
                                lastSenderId = message.id;

                                //console.log(showName)
                                //console.log("last sender"+lastSenderId)
                                if (currUser === lastSenderId){
                                    return (
                                    <TheirMessages
                                        key={index}
                                        showName={showName}
                                        message={message.message}
                                        user_name={message.user_name}/>
                                        )
                                }else{


                                    return (

                                        <Message
                                            key={documetID}
                                            showName={showName}
                                            message={message.message}
                                            user_name={message.user_name}
                                            docId={documetID}
                                            user={message.user}
                                            userImage={message.userImage}
                                            timestamp={message.timestamp}

                                        />
                                    )


                            })


                            /*const {message, timestamp, user, userImage, user_id} = doc.data();


                            if (userID.uid === user_id){
                                return (
                                    <Message
                                        key={doc.id}
                                        docId={doc.id}
                                        user={user}
                                        user_id={user_id}
                                        userImage={userImage}
                                        timestamp={timestamp}
                                        message={message}


                                    />
                                )
                            }


                            return (
                                <Message
                                    key={doc.id}
                                    docId={doc.id}
                                    user={user}
                                    userImage={userImage}
                                    timestamp={timestamp}
                                    message={message}

                                />
                            )*/

                        }
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

