import React, {useEffect, useState} from 'react';
import styled from "styled-components"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import CreateIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import DraftsIcon from "@material-ui/icons/Drafts";
import InboxIcon from "@material-ui/icons/Inbox";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import AppIcon from "@material-ui/icons/Apps";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SidebarOption from "./SidebarOption";
import {useCollection} from "react-firebase-hooks/firestore";
import {auth, db} from "../app/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import List from "./Test Arena Playground/List";


function Sidebar(props) {
    const [channels, loading, error] = useCollection(db.collection('rooms'));

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [width, setWidth] = useState(window.innerWidth);
    const [userID] = useAuthState(auth);
    const currentUser = userID.displayName;
    const [hideBadge, setHideBadge] = useState()

    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState();
    const [movies, setMovies] = useState([]);


    /*const updateBadges = () => {
        channels?.docs.map((rooms) => {
            console.log(rooms.id)
            const dbMs = db.collection('rooms').doc(rooms.id)
                .collection('messages')

            dbMs.orderBy('timestamp', 'desc')

                .limit(1)

                .get()
                .then((s) => {

                    s.docs.map((s1) => {
                        //console.log(s1)
                        if (s1.data()?.user_id !== userID.uid){

                            // console.log(dbMs.doc('reads').collection(userID.uid))
                            if (dbMs.doc('read').collection(userID.uid)){
                                setHideBadge(true)
                                console.log(s1.id+' returned true')
                            }
                            else {
                                setHideBadge(false)
                                console.log(s1.id+' returned false')
                            }


                        }else {
                            setHideBadge(false)
                        }
                        // console.log(s1.data())


                    })
                })

            //alert(rooms.id+" for "+rooms.data().name+" was found")

        })
    }*/



    useEffect(() => {
       //updateBadges()
        db.collection('rooms').get()
            .then(response => {
                const fetchedCinemas = [];
                response.docs.forEach(document => {
                    const fetchedCinema = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedCinemas.push(fetchedCinema);
                });
                setCinemas(fetchedCinemas);
            })
            .catch(error => {
                alert(error);
            });

    }, [])









        return (
            <SidebarContainer

            >
              <SidebarHeader>
                    <SidebarInfo>
                        <h2>GIDDY'S SLACK CLONE</h2>
                        <h3>
                            <FiberManualRecordIcon/>
                            {currentUser}
                        </h3>
                    </SidebarInfo>
                    <CreateIcon/>
                </SidebarHeader>
                <SidebarOption isSidebarOpen={isSidebarOpen} Icon={InsertCommentIcon} title="Threads"/>
                <SidebarOption Icon={InboxIcon} title="Mentions & reactions"/>
                <SidebarOption Icon={DraftsIcon} title="Saved items"/>
                <SidebarOption Icon={BookmarkBorderIcon} title="Channel browser"/>
                <SidebarOption Icon={PeopleAltIcon} title="People & user groups"/>
                <SidebarOption Icon={AppIcon} title="Apps"/>
                <SidebarOption Icon={FileCopyIcon} title="File Browser"/>
                <SidebarOption Icon={ExpandLessIcon} title="Show less"/>

                <hr/>
                <SidebarOption Icon={ExpandMoreIcon} title="Channels"/>

                <hr/>
                <SidebarOption Icon={AddIcon} addChannelOption title="Add Channels"/>


                {channels?.docs.map((doc) => (
                    <SidebarOption
                        key={doc.id}
                        id={doc.id}
                        title={doc.data().name}


                    />

                ))}
            </SidebarContainer>
        )






}

export default Sidebar;

const SidebarContainer = styled.div`
  background-color: var(--slack-color);
  color: white;
  border-top: 1px solid #49274b;
  margin-top: 60px;
  overflow-y: scroll;  
  >hr{
  border: 1px solid #49274b;
  margin-top: 10px;
  margin-bottom: 10px;
  
  }
  ::-webkit-scrollbar {
    width: 0;  /* Remove scrollbar space */
    background: transparent;  /* Optional: just make scrollbar invisible */
}
`

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #49274b;
  padding: 13px;
  left: -100%;
  
  >.MuiSvgIcon-root{
  padding: 8px;
  color: #49274b;
  font-size: 18px;
  background-color: white;
border-radius: 50%;  
  }

`
const SidebarInfo = styled.div`
  flex: 1;
  >h2{
  font-size: 15px;
  font-weight: 900;
  margin-bottom: 5px;
  }
  >h3{
  display: flex;
  font-size: 13px;
  font-weight: 400;
  align-items: center;
  }
  
  >h3 > .MuiSvgIcon-root{
  font-size: 14px;
  margin-top: 1px;
  margin-right: 2px;
  color: green;
  }
  
`

