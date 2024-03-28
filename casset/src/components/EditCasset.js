import React, { useEffect, useState } from 'react';
import '../css/EditCasset.css';
import { Button } from 'react-bootstrap';
import Note from './Note'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //senorita awesome!
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'; // Import the trash icon
import {deletePlaylist,fetchCasset} from '../controller/playlistController';
import {deleteSongs,fetchGetMultiSongs} from '../controller/songsController';
import { postSharedPlaylist } from '../controller/playlistController';
import { addSharedCasset } from '../controller/friendsController';

// Hardcoded images here
import defaultspotifyCover from '../media/defaultplaylist.png';
import c1 from '../media/casset_options/c1.png';
import c2 from '../media/casset_options/c2.png';
import c3 from '../media/casset_options/c3.png';
import c4 from '../media/casset_options/c4.png';
import c5 from '../media/casset_options/c5.png';
import c6 from '../media/casset_options/c6.png';
import c7 from '../media/casset_options/c7.png';
import c8 from '../media/casset_options/c8.png';
import c9 from '../media/casset_options/c9.png';
import c10 from '../media/casset_options/c10.png';

function EditCasset({ onClose, playlistID, friends }    ) {

    // chosen playlist to Edit or Play
    const [songsDocs, setSongsDocs] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [playlistDescription, setPlaylistDescription] = useState([]);
    const [playlistImage, setPlaylistImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const cassetImages = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10]

    useEffect(() => {
        handleRandomImageSelect(); // Initialize with a random image when component mounts
      }, []);
  
      const handleRandomImageSelect = () => {
      const randomIndex = Math.floor(Math.random() * cassetImages.length);
      const randomImage = cassetImages[randomIndex];
        setSelectedImage(randomImage);
      };

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

                // Fetch playlist image if it exists
                const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from localStorage
                const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const playlistImageResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/images`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const playlistData = await playlistResponse.json();
                setPlaylistDescription({
                    description: playlistData.description, // Get description from playlistData
                });
                const imageJson = await playlistImageResponse.json();
                if (imageJson && imageJson.length > 0) {
                    setPlaylistImage(imageJson[0].url);
                } else {
                    // Set a default cover image if no playlist image is available
                    setPlaylistImage(defaultspotifyCover);
                }
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        }

        fetchSelectedPlaylist();
    }, [playlistID]);

    const [showSharePopup, setShowSharePopup] = useState(false);

    const toggleSharePopup = () => {
        setShowSharePopup(!showSharePopup);
    };

    // Functionality for delete button
    const handleDelete = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete this casset?');
        if (isConfirmed) {
            deleteSongs(playlistID);
            deletePlaylist(playlistID);
            onClose(); // Close the edit cassette component
        }   
    };

    // functionality for sharing casset
    const handleFriendSelect = (friend) => {
        // Prompt confirmation before sharing with the selected friend
        const profileData = JSON.parse(localStorage.getItem('profile'))
        const isConfirmed = window.confirm(`Are you sure you want to share casset "${selectedPlaylist.playlist_name}" with ${friend}?`);
        if (isConfirmed) {
            console.log(`Sharing playlist ${selectedPlaylist.playlist_name} with friend:`, friend);
            
            // Logic to share the playlist with the selected friend...
            setShowSharePopup(false);
            
            // makes shared_casset true
            postSharedPlaylist(selectedPlaylist._id)
            // add update friends 
            addSharedCasset(profileData['name'], profileData['email'], friend, selectedPlaylist._id)
            // .then(data => {
            //     console.log(data)
            // })

        }
    };

    return (
        <div id="casset-edit">
            <div id="casset-side-box">
                <img src={playlistImage ? playlistImage : defaultspotifyCover} alt="spotify cover" id="spotify-cover"/>
                <p className="russo-one-regular" id="spotify-desc-title">description</p>
                <p id="spotify-desc">{playlistDescription.description ? playlistDescription.description: "No description yet!"}</p>
                <p className="russo-one-regular" id="date-created">date created:</p>
                <p id="date">{selectedPlaylist.date_created}</p>
                <div id="share-button-div">
                    <button type="button" className="russo-one-regular" id="share-button" onClick={toggleSharePopup}>share</button>
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
                        <img src={selectedImage} alt="temp cover" id="casset-cover"/>
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
            {showSharePopup && (
            <div id="share-popup-overlay">
                <div id="share-popup">
                    {/* Close button */}
                    <button className="close-button" onClick={toggleSharePopup}>
                        <b>X</b>
                    </button>
                    {/* Share content */}
                    <div id="share-content" className="scrollable">
                        <p id="share-prompt" className="russo-one-regular" >Select a friend to share "{selectedPlaylist.playlist_name}" with:</p>
                        {/* Add your share options here */}
                            {friends.map((friend, index) => (
                                <div key={index}>
                                    <button onClick={() => handleFriendSelect(friend)} className="friend-button">
                                        {friend}
                                    </button>
                                </div>
                            ))}                                                                                      
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}

export default EditCasset;