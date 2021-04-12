import React, {createContext, useContext, useEffect, useState} from 'react';
import styled from "styled-components"
import {auth, db} from "../app/firebase";
import {useCollection} from "react-firebase-hooks/firestore";
import List from "./Test Arena Playground/List";
import {useAuthState} from "react-firebase-hooks/auth";


function TestArena(){
    const [roomsRef] = useCollection(db.collection('rooms'));
    const [userID] = useAuthState(auth);
    const [hasRead, setHasRead] = useState(false)
    const [lastMsg, setLastMsg] = useState()
    let msgs = []

    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState();

    const selectCinema = (cinema) => {
        setSelectedCinema(cinema);
        db.collection('rooms').doc(cinema.id).collection('messages').get()
            .then(response => {
                const fetchedMovies = [];
                response.forEach(document => {
                    const fetchedMovie = {
                        id: document.id,
                        ...document.data()
                    };
                    fetchedMovies.push(fetchedMovie);
                });
                setMovies(fetchedMovies);
            })
            .catch(error => {
                setError(error);
            });
    }

    const timestampToString = (timestamp) => {
        return Date(timestamp).toString();
    }

    useEffect(() => {
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
                setError(error);
            });
    }, []);



    return (
        <div>
            {error ? (
                <p>Ops, there is an error :(</p>
            ) : null}
            <ul>
                {cinemas.map(cinema => (

                    <List key={cinema.id} onClick={() => selectCinema(cinema)} _id={cinema.id} name={cinema.name}>

                    </List>
                ))}
            </ul>
            {selectedCinema ? (
                <ul>
                    {movies.map(movie => (
                        <li key={movie.id}>
                            <b>{movie.id}</b> | {movie.message}}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );

}
export default TestArena

const TestAreaContainer = styled.div`

  align-items: center;

  
  >h3{
  color: ${p=>p.width ? "red":"green"};
  }

`;
const TestAreaContainers = styled.div`

  align-items: center;
  background-color: #3f0f40;

`;
