import React, {useEffect, useState} from 'react';
import {auth, db} from "../../app/firebase";
import {useAuthState} from "react-firebase-hooks/auth";

function List({name, _id, hasRead, message}) {

    const [userID] = useAuthState(auth);
    const [chatMessages, setChatMessages] = useState([])
    const [readReports, setReadReports] = useState()

    const readsRef = db.collection('rooms').doc(_id)
    const readReciptRef = readsRef.collection('reads').doc(userID.uid)

    useEffect(() => {
       // console.log("I am "+userID.displayName+" and my UID is "+userID.uid )



            readsRef.collection('messages').orderBy('timestamp', 'desc')

                .limit(1).onSnapshot((snapshot => {


                readReciptRef.get().then((doc) => {
                    if (doc.exists) {
                        setReadReports(true)
                        console.log(`${name} - ${chatMessages.message} READ`)
                    } else {
                        console.log(`${name} - ${chatMessages.message} >>>>>UNREAD`)
                        setReadReports(false)
                    }
                })

            snapshot.docs.map((doc) => {

                setChatMessages(doc.data())
                //console.log(chatMessages)

            })

        }))

    }, [])


    return (
        <div>

            {readReports ? `${name} - ${chatMessages.message} READ` : `${name} - ${chatMessages.message}>>>>>UNREAD` }



        </div>
    );
}

export default List;