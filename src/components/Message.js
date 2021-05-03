import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../app/firebase";
import {useSelector} from "react-redux";
import {selectRoomId} from "../features/appSlice";
import ThumbUpIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownAltIcon from "@material-ui/icons/ThumbDownAlt";
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import DeleteIcon from '@material-ui/icons/Delete';

import firebase from "firebase";

import {Arrow, useLayer} from "react-laag";

import {AnimatePresence, motion} from "framer-motion";
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import moment from "moment";




function Message({message, timestamp, user, userImage, docId, user_id, firstMessage, showName}) {
    const isCurrent = useRef(true)
    const [userName] = useAuthState(auth);
    const roomId = useSelector(selectRoomId);
    const [style, setStyle] = useState({display: 'none'});
    const [likesCount, setLikesCount] = useState(0);
    const [like, setLike] = useState(false);
    const [isMine, setIsMine] = useState(true);
    //Toggler for hover
    const [isOpen, setOpen] = useState(false);
    let  [showimage, setShowImage] = useState(false)
    const [timeSent, setTimeSent] = useState(null)

    // helper function to close the menu
    function close() {
        setOpen(false);
    }

    //get the user ID of the currently logged in user

    const loggedIn_user = userName.uid;

    //Firestore collection references
    const dbRef = db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(docId)
    const likesRef = db.collection('rooms').doc(roomId).collection('messages').doc(docId).collection('likes')
    const UserReadsRef = db.collection('users').doc(loggedIn_user).collection('rooms').doc(roomId)
    const messagesRef = db.collection('rooms').doc(roomId).collection('messages').doc(docId)
    const readsRef = useDocument(db.collection('rooms').doc(roomId).collection('messages').doc(docId))
    const messageRef = db.collection('rooms').doc(roomId).collection('messages')
    //const isFirstMessageByUser = !lastVisisble || las

    //check next visible message

    messagesRef.get().then((snap) => {
        snap.data()?.user_id === loggedIn_user ? setIsMine(true) : setIsMine(false)



        messageRef.startAfter()
    })




    //check if message is mine -- then float it right
    const checkMyMessage = () => {
        messagesRef.get().then((snap) => {
            snap.data()?.user_id === loggedIn_user ? setIsMine(true) : setIsMine(false)

        })
    }
    //check if messages are from same user
    const checkRelated = () => {
        messagesRef.get().then((snap) => {
            if(snap.data()?.related === true){
                setShowImage(true)


            }else{
                setShowImage(true)

            }

        })
    }
    //count likes
    const countLikes = () =>{
        db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .doc(docId)?.get().then(querySnapshot => {


                setLikesCount(querySnapshot.data()?.likesCount)
                //console.log(`Number of likes = ${querySnapshot.data()?.likesCount}`);
        })
    }

    //hover effect to display reactionbar
    const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
        isOpen,
        onOutsideClick: close, // close the menu when the user clicks outside
        onDisappear: close, // close the menu when the menu gets scrolled out of sight
        overflowContainer: false, // keep the menu positioned inside the container
        auto: true, // automatically find the best placement
        placement: "top-end", // we prefer to place the menu "top-end"
        triggerOffset: -12, // keep some distance to the trigger
        containerOffset: -16, // give the menu some room to breath relative to the container
        arrowOffset: -16 // let the arrow have some room to breath also
    });



    const getDaysDiff = (start_date, end_date, date_format = 'YYYY-MM-DD') => {
        const getDateAsArray = (date) => {
            return moment(date.split(/\D+/), date_format);
        }
        return getDateAsArray(end_date).diff(getDateAsArray(start_date), 'days') + 1;
    }



    useEffect(() => {

        //check the last added message

        if (isCurrent.current){
            db.collection('rooms')
                .doc(roomId)
                .collection('messages')
                .doc(docId).collection('likes')?.doc(userName.uid).get().then(querySnapshot => {
                querySnapshot.data()?.like === 'liked' ? setLike(true) : setLike(false)
            })
            checkMyMessage();
            countLikes();
        }

        return () => {
            isCurrent.current = false;
        }

    }, []);

   // checkRelated()

    const markLastMessageRead = () => {
        messageRef.orderBy("timestamp", "desc").limit(1)
            .onSnapshot(snapshot => {
                snapshot.docs.map((response) => {
                    UserReadsRef.set({
                        id: response.id,
                        read:true
                    })

                })
            })
    }




    return (
        <>


            <MessageContainer

                /*Hover effects for each message*/
                onClick={e => {
                    setStyle({display: 'block'});

                }}
                onMouseLeave={e => {
                    setStyle({display: 'none'})
                }}

                isMine={isMine}
            >

                {/*Load Image here*/}

                {showName ? <img src={userImage} alt="Legacy" isMine={isMine}/> : <HiddenImg/> }



                <p> </p>
                <MessagePositionHolder
                    {...triggerProps}
                    onClick={e => {
                        setOpen(true)
                    }

                    }
                    onMouseLeave={e => {
                        setOpen(!isOpen)

                    }}

                    isMine={isMine}

                >



                    {/*Format and display the message*/}
                    <MessageInfo>

                        <div>

                            <h4>
                                {!isMine && showName ? <>{user} <span>{getDaysDiff(moment(timestamp?.toDate()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")) === 1 ? `Today at ${moment(timestamp?.toDate()).format("HH:mm")}` :
                                    getDaysDiff(moment(timestamp?.toDate()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")) === 2 ? `Yesterday at ${moment(timestamp?.toDate()).format("HH:mm")}` :
                                    `${moment(timestamp?.toDate()).format("DD/MM HH:mm")}`}</span></> :<><span>{getDaysDiff(moment(timestamp?.toDate()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")) === 1 ? `Today at ${moment(timestamp?.toDate()).format("HH:mm")}` :
                                    getDaysDiff(moment(timestamp?.toDate()).format("YYYY-MM-DD"), moment(new Date()).format("YYYY-MM-DD")) === 2 ? `Yesterday at ${moment(timestamp?.toDate()).format("HH:mm")}` :
                                        `${moment(timestamp?.toDate()).format("DD/MM HH:mm")}`}</span></>}

                            </h4>

                            {userName.uid  === user_id ?
                                <MessageDeleter userName={user}><h3 onClick={() => {
                                    messagesRef.delete()


                                }}><strong>...</strong></h3></MessageDeleter>
                                :
                                null
                            }



                        </div>

                        <p>{message}</p>


                        <ReactionBar>

                            {like ? <ThumbUpIcon/> :
                                likesCount > 0 ?
                                <ThumbUpOutlinedIcon/> : null}

                            {likesCount > 0 ? <h3>{likesCount}</h3> : null }


                        </ReactionBar>
                    </MessageInfo>

                </MessagePositionHolder>
                {renderLayer(
                    <AnimatePresence>
                        {isOpen && (
                            <motion.ul {...layerProps}>
                                <EmojiBar style={style}
                                >
                                    <div>
                                        <LikePackage onClick={() => {

                                            const isLiked = () => {
                                                likesRef?.doc(userName.uid).get().then(querySnapshot => {
                                                    querySnapshot.data()?.like === 'liked' ? setLike(true) : setLike(false)
                                                })
                                            };
                                            isLiked();
                                            console.log(like)
                                            console.log(`user id is ${userName.uid}`)

                                            const u_id = userName.uid;
                                            if (!like){

                                                markLastMessageRead()

                                                likesRef.doc(u_id)
                                                    .set({

                                                        like: 'liked',
                                                    })
                                                    .then(() => {
                                                        console.log("Updated likes")
                                                        dbRef.update({

                                                            likesCount: likesCount+1
                                                        })

                                                    }).catch(error => {
                                                    console.log(error.getMessage)
                                                })
                                            }
                                            else {
                                                likesRef.doc(u_id)
                                                    .update({

                                                        like: firebase.firestore.FieldValue.delete()

                                                    })
                                                    .then(() => {
                                                        dbRef.update({
                                                            likesCount: likesCount-1
                                                        })
                                                    }).catch(error => {
                                                    console.log(error.getMessage)
                                                })

                                            }

                                        }}>{like ?
                                            <ThumbUpIcon/> : <ThumbDownAltIcon/>}

                                        </LikePackage>

                                        <EmojiEmotionsIcon/>

                                        {userName.uid === user_id ? <DeleteIcon onClick={() => {

                                            messagesRef.delete()


                                        }} /> : null}

                                    </div>

                                </EmojiBar>
                                {/*<Arrow {...arrowProps} />*/}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                )}
            </MessageContainer>

        </>
    );
}

export default Message;
const MessageContainer =  styled.div`
display: flex;
align-items: center;
padding: ${p=>p.showimage ? '6px' : '2px'};
justify-content: ${p => p.isMine ? 'space-between' : 'left'};
>img{
height: 50px;
border-radius: 8px;
display: ${p=>p.isMine ? 'none' : 'block'};


}
`
const HiddenImg = styled.div`

margin-left: 50px;

visibility: hidden;

`
const MessageInfo =  styled.div`
    
  >p{
  color: black;
  z-index: 99;
  }
  >h4{
  color: black;
  z-index: 99;
  }

div{
align-content: space-between;
display: flex;
align-items: center;
>h4 > span{
color: black;
font-weight: 300;
margin-left: 7px;
font-size: 14px;
float: right;

}

}
`
const MessageDeleter = styled.div`
  >h3{
float: right;
top: 0;

display: ${p=>p.userName ? 'center': 'none'};
}
`
const EmojiBar = styled.div`
  height: 30px;
  display: flex;
  width: 100px;
  border: 1px solid var(--slack-color);
  float: right;
  border-radius: 5px;
  >div{
  display: flex;
  margin-left: 5px;
  
  justify-content: space-between;
  align-items: center;
  >.MuiSvgIcon-root{
  font-size: 20px;
  color: var(--slack-color);
  :hover{
    font-size: 30px;
  }
  }
  }
`

const LikePackage = styled.div`

>.MuiSvgIcon-root{
  color: var(--slack-color);
  :hover{
  font-size: 30px;
  }
  }
  font-size: 20px;
  cursor: pointer;
  
`
const ReactionBar = styled.div`
  >.MuiSvgIcon-root{
  color: var(--slack-color);
  }
  float: right;
    
`
const MessagePositionHolder = styled.div`
  display: flex;
align-items: center;
padding-top: 5px;
padding-left: 5px;
padding-right: 20px;
padding-bottom: 7px;
margin-left: 5px;
background: ${p => p.isMine ? '#b1cdfa' : 'lightgray'};
max-width: 50%;
>img{
height: 50px;
border-radius: 8px;
}
  opacity: .5;

  align-self: end;
  border-radius: 7px;
  border: 1px solid #340e36;
`

