import React, {useRef, useState} from 'react';
import styled from "styled-components"
import Button from "@material-ui/core/Button";
import {auth, db} from '../app/firebase'
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";

function ChatInput({channelName, channelId, chatRef}) {
    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);
    const allMessagesRef = db.collection('rooms').doc(channelId).collection('messages').orderBy('timestamp', 'asc');


    const sendMessage = e => {
        e.preventDefault();
        if (input) {
            if (!channelId) {
                return false;
            }

            allMessagesRef.get().then((documentSnapshots)=> {
                const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];



                console.log('The document id be '+lastVisible?.id)

                if (lastVisible?.data().user_id === user.uid) {

                    db.collection('rooms')
                        .doc(channelId).collection('messages')
                        .add({
                            user_id: user.uid,
                            message: input,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            user: user.displayName,
                            userImage: user.photoURL,
                            likesCount: 0,



                        }).then((rs) =>{
                            console.log(rs.id)
                        db.collection('rooms').doc(channelId).collection('messages').doc(rs.id).collection('reads')
                            .doc(user.uid).set({
                            read: true
                        })



                    });
                }else{
                    db.collection('rooms')
                        .doc(channelId).collection('messages')
                        .add({
                            user_id: user.uid,
                            message: input,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            user: user.displayName,
                            userImage: user.photoURL,
                            likesCount: 0,

                        });
                }
            });



        }
        chatRef.current.scrollIntoView({
            behavior:'smooth',

        });
        setInput("")

    }
    return (
        <ChatInputContianer>
            <form>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message #${channelName}`}/>
                <Button hidden type="submit" onClick={sendMessage}>
                    SEND
                </Button>
            </form>
        </ChatInputContianer>
    );
}

export default ChatInput;

const ChatInputContianer = styled.div`
  border-radius: 20px;
  >form{
  position: relative;
  display: flex;
  justify-content: center;
  }
  >form > input{
  position: fixed;
  width: 60%;
  bottom: 30px;
  border: 1px solid gray;
  border-radius: 3px;
  padding: 20px;
  outline: none;
  }
  >form >Button{
  bottom: 30px;
  position: fixed;
  display: none;
  }
`