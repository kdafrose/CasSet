import React, { useState, useEffect } from 'react';
import '../css/PlayCasset.css';
import {Button} from 'react-bootstrap';
import {fetchGetMultiSongs} from '../controller/songsController';
import {fetchCasset} from '../controller/playlistController';
import PlaySong, { DisconnectPlayer, playerInstance } from './PlaySong';
import { NoteContent } from './Note';

function PlayCasset({ playlistID, playlistName, onClose }) {
    const [songDocs, setSongDocs] = useState([]);
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

    const playlistInfo = {
        "playlistID" : playlistID,
        "playlistName" : playlistName
    }

    return (
        <>
            <div id="casset-play-top">  
                <Button id="back" onClick={() => DisconnectPlayer(playerInstance, onClose)}>go back</Button>
                <p className="russo-one-regular" id="casset-title-play">{playlistName}</p>
            </div>
            <div id="big-purple-container" className="scrollable">
                <div id="left-play-song">
                    <PlaySong playingData={playlistInfo}onNext={handleNextNote} onPrev={handlePrevNote}/>
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