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
        setNoteId(prevId => prevId === 1 ? maxNoteId : prevId - 1); // Decrement noteId, but ensure it loops back to maxNoteId
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
                    <PlaySong playingData={playlistInfo}onNext={handleNextNote} onPrev={handlePrevNote} closer={onClose} />
                </div>
                <div id="right-cassetandnote">
                    <div id="show-note" className="scrollable">
                        <div id="the-note">
                            {/* Conditional rendering based on loading state */}
                            {loading ? <p>Loading...</p> : <NoteContent noteId={noteId} songItems={songDocs} />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlayCasset