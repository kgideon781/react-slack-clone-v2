import React from 'react';
import styled from "styled-components"
import {Avatar} from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import SearchIcon from '@material-ui/icons/Search';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Cancel from '@material-ui/icons/Cancel';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, provider} from "../app/firebase";
import {enterRoom} from "../features/appSlice";
import {useDispatch} from "react-redux";

function Header(props) {
    const [user] = useAuthState(auth);
    const dispatch = useDispatch();
    return <HeaderContainer>
        {/*Header Left*/}
        <HeaderLeft>
            <HeaderAvatar onClick={()=>auth.signOut()} src={user?.photoURL} alt={user?.displayName}/>
            <AccessTimeIcon/>
        </HeaderLeft>

        {/*Header Search*/}

        <HeaderSearch>
            <SearchIcon/>
            <input placeholder="Search MYCOMMUNITY"/>

        </HeaderSearch>


        {/*Header Right*/}

        <HeaderRight>
            <HelpOutlineIcon/>
            <Cancel />
        </HeaderRight>

    </HeaderContainer>
}

export default Header;

const HeaderContainer = styled.div`
    display: flex;
    position: fixed;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    background-color: var(--slack-color);
    color: white;
    `;
const HeaderLeft = styled.div`
flex: .3;
display: flex;
margin-left: 20px;
align-items: center;

>.MuiSvgIcon-root{
margin-left: auto;
margin-right: 30px;
}
  
`;
const HeaderAvatar = styled(Avatar)`
  cursor: pointer;
  :hover{
  opacity: .8;
  }
  
`;
const HeaderSearch = styled.div`
  flex: .4;
  opacity: 1;
  border-radius: 6px;
  background-color: #421f44;
  text-align: center;
  display: flex;
  padding: 0 50px;
  color: gray;
  border: 1px gray solid;
  
  >input{
  background-color: transparent;
  border: none;
  text-align: center;
  min-width: 30vh;
  outline: none;
  color: white;
  }
`;
const HeaderRight = styled.div`
  flex: .3;
  display: flex;
  align-items: flex-end;
  >.MuiSvgIcon-root{
  margin-left: auto;
  margin-right: 20px;
  }
`
