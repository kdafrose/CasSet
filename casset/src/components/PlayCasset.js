import React, { useState } from 'react';
import '../css/PlayCasset.css';
import PlaySong from './PlaySong';

function PlayCasset({ onClose }) {
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
                <div id="casset-play-top">
                    <Button id="back" onClick={onClose}>go back</Button>
                    <p className="russo-one-regular" id="casset-title-play">goatedmusic.</p>
                </div>
                <div id="big-purple-container">
                    <div id="left-play-song">
                        <PlaySong onNext={handleNextNote} onPrev={handlePrevNote} />
                    </div>
                    <div id="right-cassetandnote">
                        <div id="show-note" className="scrollable">
                            <div id="the-note">
                                <NoteContent noteId={noteId} /> {/* need to change to show with database */}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </>
    )
}

export default PlayCasset