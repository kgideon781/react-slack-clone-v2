import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {auth, db} from "../app/firebase";
import {useDispatch} from "react-redux";
import {enterRoom} from "../features/appSlice";
import {showBadge} from "../features/firestoreSlice";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";




/*export function firestoreBadge(userID, setHideBadge, id) {
    db.collection('rooms').doc(id).collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get()
        .then((msg) => {
            msg.docs.map(looped =>{

                    if (looped.data()?.user_id !== userID.uid){
                        looped.data()?.read === true ? setHideBadge(true) : setHideBadge(false)
                    }

                }

            )

        })
}*/

function SidebarOption({Icon, title, addChannelOption, id, hideBadge}) {

    const dispatch = useDispatch();
    const [userID] = useAuthState(auth);
    const [channels, loading, error] = useCollection(db.collection('rooms'));
    const [chatMessages, setChatMessages] = useState([])
    const [readReports, setReadReports] = useState()
    //const [hideBadge, setHideBadge] = useState()
    const readsRef = db.collection('rooms').doc(id).collection('messages')
    const readReciptRef = readsRef.doc().collection('reads').doc(userID.uid)
    const [isMine, setIsMine] = useState()
    console.log(userID.uid + userID.displayName)



    /*useEffect(() => {
        channels?.docs.map((rooms) => {
            console.log(rooms.id)
            const dbMs = db.collection('rooms').doc(rooms.id)
                .collection('messages')

            dbMs.orderBy('timestamp', 'asc')

                .limit(1)

                .get()
                .then((s) => {

                    s.docs.map((s1) => {
                        //console.log(s1)
                        if (s1.data()?.user_id !== userID.uid){

                            // console.log(dbMs.doc('reads').collection(userID.uid))
                            if (dbMs.doc('read').collection(userID.uid)){
                                setHideBadge(true)
                                console.log(s1.id+' returned true for '+s1.data())
                            }
                            else {
                                setHideBadge(false)
                            }


                        }else {
                            setHideBadge(false)
                        }
                        // console.log(s1.data())


                    })
                })

            //alert(rooms.id+" for "+rooms.data().name+" was found")

        })
    }, [])*/

    useEffect(() => {



        readsRef.orderBy('timestamp', 'desc')

            .limit(1).onSnapshot((snapshot) => {
                snapshot.docs.map((snap) => {
                    setChatMessages(snap.data())

                    snap.get('user_id') === userID.uid ? setIsMine(true) : setIsMine(false)
                    console.error(snap.id)

                    readsRef.doc(snap.id).collection('read').doc(userID.uid).onSnapshot((snapshot1 => {
                        if (snapshot1.exists) {
                            setReadReports(true)
                             console.log(`${title} - ${chatMessages.message} READ`)
                        } else {
                            console.log(`${title} - ${chatMessages.message} >>>>>UNREAD`)
                            setReadReports(false)
                        }
                    }))

                })

        })
    }, [])

    const addChannel = () => {

        const channelName = prompt('Please enter the channel name')
        if (channelName){
            db.collection('rooms').add({
                name: channelName
            })
        }
    }
    const selectChannel = () => {
        let msgArray = []
        if (id){
            dispatch(enterRoom({
                roomId: id
            }))




        }
        readsRef.orderBy('timestamp', 'desc')

            .limit(1).onSnapshot((snapshot) => {
            snapshot.docs.map((snap) => {
                readsRef.doc(snap.id).collection('read').doc(userID.uid).set({
                    readReceipt: userID.uid
                }, {merge: true})
            })


        })



    }



    return (
        <>

            <SidebarOptionContainer
                onClick={addChannelOption ? addChannel : selectChannel}

            >

            {Icon && <Icon fontSize='small' style={{padding: 10}}/>}
                {Icon ? (
                    <h3>{title}</h3>
                ):(
                    <SidebarOptionChannel>
                        <span># </span>{title}<span>{readReports ? null : <UnreadBadge><span>1</span></UnreadBadge> }</span>

                    </SidebarOptionChannel>
                )}

            </SidebarOptionContainer>
        </>
    );
}

export default SidebarOption;

const SidebarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;
  
  
  :hover{
  opacity: .9;
  background-color: #340e36;
  }
  >h3{
  font-weight: 500;
  }
  >h3 > span {
  padding: 15px;
  }
`


const SidebarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight: 300;
  align-items: center;
  flex: 1;
  display: flex;
  align-content: space-between;
`
const UnreadBadge = styled.div`
  
  left: 15px;
  padding: 5px;
  border-radius: 50%;
  width: 7px;
  align-items: center;
  align-content: center;
  height: 7px;
 
  background: white;
  > span {
  color: black;
  
  }
`



