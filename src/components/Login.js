import React from 'react';
import styled from "styled-components"
import Button from "@material-ui/core/Button";
import {auth, provider, db} from "../app/firebase";
import {useCollection} from "react-firebase-hooks/firestore";


function Login(props) {
   const messagesRef = db.collection('users')
    const signIn = e => {
        e.preventDefault();
        auth.signInWithPopup(provider)
            .then((success) => {
                console.log(success)


                messagesRef.doc(success.user.uid).set({
                    user_id:success.user.uid,
                    username:success.user.displayName
                })
            })
            .catch((error) => {
           alert("We encounter this error while trying to sign you in with google: "+error.message);
        });

    }
    return (
        <LoginContainer>
            <LoginInnerContainer>
                <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" alt=""/>
                <h1>Sign in to Legacy Network</h1>
                <p>legacy.gideon.com</p>
                <Button onClick={signIn}>Sign in with Google</Button>
            </LoginInnerContainer>
        </LoginContainer>
    );
}

export default Login;

const LoginContainer = styled.div`
background-color: #f8f8f8;
height: 100vh;
display: grid;
place-items: center;
  
`
const LoginInnerContainer = styled.div`
padding: 100px;
text-align: center;
background-color: white;
border-radius: 10px;
box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  >img{
  object-fit: contain;
  height: 100px;
  margin-bottom: 40px;
  }
  >button{
  margin-top: 50px;
  text-transform: inherit !important;
  background-color: #0a8d48;
  color: white;
  
  }
`