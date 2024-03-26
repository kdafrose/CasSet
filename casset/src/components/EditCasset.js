import React, { useEffect, useState } from 'react';
import '../css/EditCasset.css';
import { Button } from 'react-bootstrap';
import Note from './Note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //senorita awesome!
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'; // Import the trash icon

// Importing songs from db
import fetchGetMultiSongs from '../controller/fetchMultiSongs';
import fetchCasset from '../controller/fetchSinglePlaylist';

// Hardcoded images here
import spotifyCover from '../media/spotifycover.jpg';
import tempCover from '../media/goatedmusic.png';

function EditCasset({ onClose, playlistID }) {
    // Sample song data

    const [songsDocs, setSongsDocs] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    
    // gets songs information
    useEffect(() => {
        const fetchSongsDocs = async () => {
            try {
                const songsItems = await fetchGetMultiSongs(playlistID);
                setSongsDocs(songsItems);
                console.log(songsDocs);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
    
        fetchSongsDocs();
    }, [playlistID]); // Make sure to include playlistID in the dependency array
    
    // gets playlist information
    useEffect(() => {
        const fetchSelectedPlaylist = async () => {
            try {
                const chosenPlaylist = await fetchCasset(playlistID);
                setSelectedPlaylist(chosenPlaylist);
                console.log(selectedPlaylist);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        }

        fetchSelectedPlaylist();
    }, [playlistID]);

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
                <p id="spotify-desc">{selectedPlaylist.note}</p>
                <div id="date-container">
                    <p className="russo-one-regular" id="date-created">date created:</p>
                    <p id="date">{selectedPlaylist.date_created}</p>
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
                            <p className="russo-one-regular" id="casset-title">{selectedPlaylist.playlist_name}</p>
                    </div>
                    <div id="casset-list-in-edit">
                        {songsDocs.map((song, index) => (
                            <div>
                                <div key={`song-${index}`} className="song-box-info">
                                    <p id="spotify-number" className="russo-one-regular">{index + 1}</p>
                                    <img src={song.song_image} alt="artist image" id="spotify-artist-image"/>
                                    <div>
                                        <p id="spotify-songname-format"><strong>{song.name}</strong></p>
                                        <p id="spotify-artistname-format">{song.artist}</p>
                                    </div>
                                </div>
                                {/* corresponding Note component for each song */}
                                <Note key={`note-${index}`} noteId={index + 1} songsItems = {songsDocs} playlistItem = {selectedPlaylist} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCasset;
