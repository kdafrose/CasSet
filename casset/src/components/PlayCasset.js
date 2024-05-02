import React, { useState, useEffect } from 'react';
import '../css/PlayCasset.css';
import {Button} from 'react-bootstrap';
import {fetchGetMultiSongs} from '../controller/songsController';
import {fetchCasset} from '../controller/playlistController';
import PlaySong, { DisconnectPlayer, playerInstance } from './PlaySong';
import { NoteContent } from './Note';

function PlayCasset({ playlistID, playlistName, onClose }) {
    const [playSong, setPlaySong] = useState(true);
    const [songDocs, setSongDocs] = useState([]);
    const [lastSong, setLastSong] = useState("");
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [noteId, setNoteId] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state
    
    // gets playlist information
    useEffect(() => {
        const fetchSelectedPlaylist = async () => {
            try {   
                await fetchCasset(playlistID)
                    .then((data) => {
                        setSelectedPlaylist(data);
                    })
                await fetchGetMultiSongs(playlistID)
                    .then((response) => {
                        setSongDocs(response);
                        setLastSong(response[response.length - 1]?.songID);
                        console.log("lastSong:", response[response.length - 1]?.songID);
                    })
                setLoading(false);
            } catch (error) {
                console.error('Error fetching playlist:', error);
                setLoading(false);
            }
        };
        
        if (playlistID) {
            fetchSelectedPlaylist();
        }
    }, [playlistID]);
    
    const maxNoteId = songDocs.length;
    const handleNextNote = () => {
        setNoteId(prevId => prevId === maxNoteId ? 1 : prevId + 1); // Increment noteId, but ensure it loops back to 1
    };

    const handlePrevNote = () => {
        playerInstance.getCurrentState().then(state => {
            if (state) {
                console.log("currentID (PlayCasset):", state.track_window.current_track.id);
                setNoteId(prevId => {
                    if (prevId === 1) {
                        return 1;
                    } else {
                        const previousSongID = songDocs[prevId - 1]?.songID;
                        console.log("current ID:", state.track_window.current_track.id);
                        console.log("previous ID:", previousSongID);
                        if (state.track_window.current_track.id === previousSongID) {
                            // If current song is the same as previous song, stay at current
                            console.log("prevID (same):", prevId);
                            return prevId;
                        } else {
                            // If different songs, decrement noteId
                            console.log("prevID (decrement):", prevId);
                            return prevId - 1;
                        }
                    }
                });
            }
        });
    };    

    const handleRestartPlaylist = () => {
        // Once playlist completes re-render PlaySong component
        setPlaySong(false);
        setTimeout(() => {
            setPlaySong(true);
        }, 500); // Delay execution by 500 milliseconds
    }

    let playlistInfo = {};

    if (lastSong !== undefined) {
        playlistInfo = {
            "playlistID" : playlistID,
            "playlistName" : playlistName,
            "lastSongID" : lastSong
        };
    }

    return (
        <>
            <div id="casset-play-top">  
                <Button id="back" onClick={() => DisconnectPlayer(playerInstance, onClose)}>go back</Button>
                <p className="russo-one-regular" id="casset-title-play">{playlistName}</p>
            </div>
            <div id="big-purple-container" className="scrollable">
                <div id="left-play-song">
                    {playSong ? (
                        !lastSong ? (
                            <div className="container">
                                <div className="main-wrapper">
                                    <b className="transfer-instance"> Transferring the instance to CasSet... </b>
                                </div>
                            </div>
                        ) : (
                            <PlaySong
                                playingData={playlistInfo}
                                onNext={handleNextNote}
                                onPrev={handlePrevNote}
                                songCloser={() => handleRestartPlaylist()}
                            />
                        )
                    ) : <div className="container">
                            <div className="main-wrapper">
                                <b className="transfer-instance"> Restarting playlist... </b>
                            </div>
                        </div>}
                </div>
                <div id="right-cassetandnote">
                    <div id="show-note" className="scrollable">
                        <div id="the-note">
                            {/* Conditional rendering based on loading state */}
                            {loading ? <p>Loading...</p> : <NoteContent noteId={noteId} songItems={songDocs} />}
                        </div>
                    </div>
                    <div id="page-num">
                        <p id="num" className="russo-one-regular">{noteId}.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlayCasset