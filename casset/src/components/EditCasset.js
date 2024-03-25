import React from 'react';
import '../css/EditCasset.css';
import { Button } from 'react-bootstrap';
import Note from './Note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //senorita awesome!
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'; // Import the trash icon

// Hardcoded images here
import spotifyCover from '../media/spotifycover.jpg';
import tempCover from '../media/goatedmusic.png';
import artistImage from '../media/artistimage.png';
import artistImage2 from '../media/rina.JPG';

function EditCasset({ editCasset, onClose }) {
    // Functionality for delete button (for now, same as back button)
    const handleDelete = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this casset?');
        if (isConfirmed) {
            onClose(); // Close the edit cassette component
        }
    };

    return (
        <div id="casset-edit">
            <div id="casset-side-box">
                <img src={spotifyCover} alt="spotify cover" id="spotify-cover"/>
                <p className="russo-one-regular" id="spotify-desc-title">description</p>
                <p id="spotify-desc">{editCasset.description}</p>
                <div id="date-container">
                    <h4 className="russo-one-regular" id="date-created">date created:</h4>
                    <p id="date">{editCasset.date}</p>
                </div>
                <div id="share-button-div">
                    <button type="button" className="russo-one-regular" id="share-button">share</button>
                </div>
            </div>
            <div id="casset-songs">
                <div id="casset-songs-top">
                    <Button id="back-button" onClick={onClose}>go back</Button>
                    <p className="russo-one-regular" id="casset-songs-title">SONGS</p>
                    {/* Delete Button */}
                    <FontAwesomeIcon icon={faTrashAlt} className="delete-button" onClick={handleDelete} title="Delete Casset"/>
                </div>
                <div id="casset-songs-box-col" className="scrollable">
                    <div id="casset-songs-row">
                        <img src={tempCover} alt="temp cover" id="casset-cover"/>
                            <p className="russo-one-regular" id="casset-title">{editCasset.name}</p>
                    </div>
                    <div id="casset-list-in-edit">
                        {songs.map((song, index) => (
                            <div>
                                <div key={`song-${index}`} className="song-box-info">
                                    <p id="spotify-number" className="russo-one-regular">{index + 1}</p>
                                    <img src={song.cover} alt="artist image" id="spotify-artist-image"/>
                                    <div>
                                        <p id="spotify-songname-format"><strong>{song.title}</strong></p>
                                        <p id="spotify-artistname-format">{song.artist}</p>
                                    </div>
                                </div>
                                {/* corresponding Note component for each song */}
                                <Note key={`note-${index}`} noteId={index + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCasset;
