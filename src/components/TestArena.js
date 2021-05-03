import React, {useEffect, useState} from 'react';
import {auth, db} from "../app/firebase";
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";

function TestArena(props) {
    const [cinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState();
    const [movies, setMovies] = useState([]);

    const [error, setError] = useState();
    const [isMine] = useState();
    const [userID] = useAuthState(auth)
    const loggedInUser = userID.uid
    const [roomsRef] = useCollection(db.collection("rooms"))

    const selectCinema = (cinema) => {

        setSelectedCinema(cinema);
        db.collection('rooms').doc(cinema.id).collection('messages')
            .orderBy("timestamp", "desc")
            .limit(1)
            .get()
            .then(response => {
                const fetchedMovies = [];
                response.forEach(document => {
                    //console.log(document.reads)


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
    const saveALike = (movie) => {
        db.collection('rooms').doc(selectedCinema.id).collection('messages')
            .doc(selectedCinema.m_id).set({
            reads: firebase.firestore.FieldValue.arrayUnion({
                //u_id: loggedInUser
            })
        }, {merge: true}).then(rs => console.log("Set"))
    }

    const timestampToString = (timestamp) => {
        return Date(timestamp).toString();
    }

    useEffect(() => {
    roomsRef?.docs.map((room) => {
        db.collection('rooms').doc(room.id).collection('messages')
            .orderBy("timestamp", "desc")
            .limit(1)
            .onSnapshot((doc) => {
                console.log(doc.data())
            })
    })

    }, [isMine]);
    return (
        <div>

            {error ? (
                <p>Ops, there is an error :(</p>
            ) : null}
            <ul>
                {cinemas.map(cinema => (

                    <li key={cinema.m_id} onClick={() => selectCinema(cinema)}>
                        <b>{cinema.fetchedCinema +"-"+ cinema.message}</b>{isMine ? "mine" : "not mine"}
                    </li>


                ))}
            </ul>
            {selectedCinema ? (
                <ul >
                    {movies.map(movie => (
                        <li key={movie.id} onClick={() => saveALike(movie)}>
                            <b>{movie.message}</b> | {movie.user_id} | {timestampToString(movie.release_date)}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

export default TestArena;