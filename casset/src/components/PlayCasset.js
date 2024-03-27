import React, { useState, useEffect } from 'react';
import '../css/PlayCasset.css';
import {fetchGetMultiSongs} from '../controller/songsController';
import {fetchCasset} from '../controller/playlistController';
import PlaySong from './PlaySong';
import { NoteContent } from './Note';

function PlayCasset({ playlistID, playlistName, onClose }) {
    const [songDocs, setSongDocs] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [noteId, setNoteId] = useState(1);
    
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
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };
        
        if (playlistID) {
            fetchSelectedPlaylist();
        }
    }, [playlistID]);
    
    const maxNoteId = songDocs.length; // this needs to depend on db later!!!
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
            <div id="big-purple-container">
                <div id="left-play-song">
                    <PlaySong playingData={playlistInfo}onNext={handleNextNote} onPrev={handlePrevNote} closer={onClose} />
                </div>
                <div id="right-cassetandnote">
                    <div id="show-note" className="scrollable">
                        <div id="the-note">
                            {/* <NoteContent noteId={noteId} songItems = {songDocs} /> need to change to show with database */}
                        </div>
                    </div>
                </div>
                <div id="right-show-note">

                </div>
            </div>
    )
}

export default PlayCasset