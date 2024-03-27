import React, { useState } from 'react';
import '../css/PlayCasset.css';
import PlaySong from './PlaySong';
import Note from './Note';

function PlayCasset({ playlistID, onClose }) {
    const [noteId, setNoteId] = useState(1);
    const maxNoteId = 12; // this needs to depend on db later!!!
    
    const handleNextNote = () => {
        setNoteId(prevId => prevId === maxNoteId ? 1 : prevId + 1); // Increment noteId, but ensure it loops back to 1
    };

    const handlePrevNote = () => {
        setNoteId(prevId => prevId === 1 ? maxNoteId : prevId - 1); // Decrement noteId, but ensure it loops back to maxNoteId
    };

    return (
            <div>
                <div id="big-purple-container">
                    <div id="left-play-song">
                        <PlaySong playingID={playlistID}onNext={handleNextNote} onPrev={handlePrevNote} closer={onClose}/>
                    </div>
                    <div id="right-cassetandnote">
                        <div id="show-note" className="scrollable">
                            <div id="the-note">
                                {/* <Note noteId={noteId} /> need to change to show with database */}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
    )
}

export default PlayCasset