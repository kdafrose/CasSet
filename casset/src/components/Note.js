import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../css/Note.css';

// importing db controller function
import editSongNote from '../controller/fetchEditNote';

function Note({ noteId, songsItems, playlistItem }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const maxCharacters = 85; // number of characters to show by default
    
    // load note content from local storage (for now)
    useEffect(() => {
        // const storedNoteContent = localStorage.getItem(`noteContent${noteId}`);
        // if (storedNoteContent) {
        //   setNoteContent(storedNoteContent);
        // }

        // loads note content from db (default of 'fill in later')
        setNoteContent(songsItems[noteId -1].annotation);
        
    }, [noteId]);

    // save note content to local storage (for now)
    useEffect(() => {
        //localStorage.setItem(`noteContent${noteId}`, noteContent);

        // fetching editNotes to put note in db
        const noteStatus = editSongNote(songsItems[noteId-1].songID, songsItems[noteId -1].playlistID, noteContent);
        console.log(noteStatus)

    }, [noteContent, noteId]);

    const handleEditButtonClick = () => {
        setIsEditing(true);
        setIsExpanded(true); // Expand the note when editing
    };
  
    const handleSaveButtonClick = () => {
        setIsEditing(false);
        setIsExpanded(false);
        // Here you can save the note content or perform any other necessary actions
    };

    const handleDeleteButtonClick = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete note ' + noteId + '?');
        if (isConfirmed) {  
            setIsEditing(false);
            setIsExpanded(false);
            localStorage.removeItem(`noteContent${noteId}`); // delete note content to local storage (for now)
            setNoteContent(''); // Clear note content
        }
    };

    const handleExpandCollapseClick = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to truncate the content to a certain number of characters
    const truncateContent = (content) => {
        return content.length > maxCharacters ? content.slice(0, maxCharacters) + '...' : content;
    };

    // Function to strip HTML tags from content
    const stripHTMLTags = (html) => {
        return html.replace(/<[^>]+>/g, '');
    };
  
    return (
        <div className="note-container">
          {isExpanded && !isEditing ? (
            <>
              <div className="note-content" dangerouslySetInnerHTML={{ __html: noteContent }} />
              <div className="default-buttons">
                <button onClick={handleEditButtonClick} className="edit-button">&#x270E;</button>
                <div id="button-center">
                    <button className="expand-collapse-button" onClick={handleExpandCollapseClick}>&#x25B2;</button>
                </div>
              </div>
            </>
          ) : (
            <>
              {isEditing && (
                <>
                  <ReactQuill
                    theme="snow"
                    value={noteContent}
                    onChange={setNoteContent}
                    placeholder="Enter your note here..."
                  />
                  <div className="edit-buttons">
                    <button onClick={handleSaveButtonClick} className="russo-one-regular" id="save-button">save</button>
                    <button onClick={handleDeleteButtonClick} className="russo-one-regular" id="delete-button">delete</button>
                  </div>
                </>
              )}
              {!isEditing && (
                <>
                  <div className="note-content">{truncateContent(stripHTMLTags(noteContent))}</div>
                  <div className="default-buttons">
                    <button onClick={handleEditButtonClick} className="edit-button">&#x270E;</button>
                    <div id="button-center">
                        <button className="expand-collapse-button" onClick={handleExpandCollapseClick}>&#x25BC;</button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
    );
}

export default Note;
