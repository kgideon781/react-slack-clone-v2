import React from 'react';
import styled from "styled-components"

import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "./app/firebase";
import Login from "./components/Login";
import Spinner from "react-spinkit";
import TestArea from "./components/TestArea";

import {useSelector} from "react-redux";

import {setBadge} from "./features/firestoreSlice";
import TestArena from "./components/TestArena";
import {selectRoomId} from "./features/appSlice";
import {useCollection} from "react-firebase-hooks/firestore";
import {onLog} from "firebase";




function App() {
    const [user, loading] = useAuthState(auth)
    const [userID] = useAuthState(auth);
    const hideBadge = useSelector(setBadge)
    const readMessages = hideBadge && db.collection("rooms").doc(hideBadge).collection("messages");
    const readsRef = hideBadge &&
        db
            .collection("rooms")
            .doc(hideBadge)
            .collection("messages")

    const [roomMessages] = useCollection(
        hideBadge &&
        db
            .collection("rooms")
            .doc(hideBadge)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .limit(1)
    );


    if (hideBadge){
        roomMessages?.docs.map((roomMsg) => {
            readsRef.doc(roomMsg.id)
                .collection("reads")
                .doc(userID.uid)
                .get().then((user) => {
                    if (user.exists){

                    }else{
                        readMessages
                            .doc(roomMsg.id)
                            .collection("reads")
                            .doc(userID.uid)
                            .set({
                                read: true
                            })
                            .then(() => console.log("Success"));
                    }
            })
        })
    }


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
  return (
    <div className="App">

        <Router>
            {!user ? (
                <Login/>
            ):(

                <>


                    <Switch>

                        <Route path="/test">
                            <TestArea/>
                        </Route>
                        <Route path="/arena">
                            <TestArena/>
                        </Route>

                        <Route path="/">
                            <Header/>
                            <AppBody>

                                <Sidebar/>

                                <Chat

                                />
                            </AppBody>


                        </Route>
                    </Switch>


                </>
            )}

        </Router>


    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  
  
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
