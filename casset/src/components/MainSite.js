import '../css/MainSite.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component
import {Collapse, Button} from 'react-bootstrap';
import FindPlaylist  from './FindPlaylist';
import EditCasset from './EditCasset';
import titleSrc from '../media/casset_title_purple.png';
import placeHold from '../media/empty_image.webp';
import logoSrc from '../media/casset.png';
import cassetteTemp from '../media/Rectangle_4.png';
import fetchPlaylists from '../controller/fetchUserPlaylists';
import iconSrc from '../media/disket.png';
import PlayCasset from './PlayCasset';

function MainSite() {
    const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
    const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b"; 
    const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/casset";
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [showUploadPlaylist, setShowUploadPlaylist] = useState(false); 
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(placeHold);
    const [savedPlaylists, setSavedPlaylist] = useState([]);
    const [editCasset, setEditCasset] = useState(false);
    const [playCasset, setPlayCasset] = useState(false);
    const [selectedPlaylistID, setSelectedPlaylistID] = useState("");
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [profileExists] = useState(()=> {
      const storedExists = localStorage.getItem("profileExists");
      console.log("PROFILE????: " + storedExists);
      return storedExists ? storedExists : null;
  });

    useEffect(() => {
      fetchPlaylists()
    .then(data => {
        if (data) {
            console.log(data);
            setSavedPlaylist(data);
            setFilteredPlaylists(data);
        } else {
            setSavedPlaylist([]);
            setFilteredPlaylists([]);
        }
    })      
  }, []); // The empty array ensures this effect runs once on mount
  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = savedPlaylists.filter(playlist => playlist.playlist_name.toLowerCase().includes(query));
    setFilteredPlaylists(filtered);
};

  const [boxVisibility, setBoxVisibility] = useState(savedPlaylists.map(() => false));
  const navigate = useNavigate();

    function clearAll(){
      // THIS ENTIRE FUNCTION CHANGES WHEN DATABASE HAPPENS
      // localStorage.removeItem("profile"); removing this for now so that we can add foreign key to playlists db
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userSpotifyID")
      localStorage.removeItem("tokenType");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("profileExists");

      return;
    }

    async function getMe() {

      const access_token_me = localStorage.getItem("accessToken");

      const meParams = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + access_token_me
        },
      };

      await fetch('https://api.spotify.com/v1/me', meParams)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        localStorage.setItem("userSpotifyID", data.id);

        const profileImage = data.images === undefined ? placeHold : data.images[0].url;

        console.log(profileImage);

        setProfileImage(profileImage);
      })
    }

    async function tokenCall(inputString) {
        var newString = inputString.substring(6); 
      
        var baseString = CLIENT_ID + ":" + CLIENT_SECRET;
      
        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'authorization_code');
        requestBody.append('redirect_uri', REDIRECT_URL_AFTER_LOGIN);
        requestBody.append('code', newString);
      
        var tokenExchangeParams = {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(baseString),
          },
          body: requestBody.toString(),
        };
      
        await fetch('https://accounts.spotify.com/api/token', tokenExchangeParams)
          .then(response => response.json())
          .then(async data => {

            // ALL OF THIS MOVES WHEN WE HAVE DATABASE CONNECTION
            clearAll();
      
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("tokenType", data.token_type);
            localStorage.setItem("expiresIn", data.expires_in);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("profileExists", "true");

            getMe();
            
            return;
          })
    }

    useEffect(() => {
        if (window.location.search && (!profileExists)) {
          tokenCall(window.location.search);
        }
        else{
          getMe();
        }
        // CHANGE localStorage to database later...

        // Retrieve profile information from local storage
        const storedProfile = localStorage.getItem("profile");
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

    const toggleBoxVisbility = (index) => {
      setBoxVisibility(prevVisible => {
        const updatedVisibliity = [...prevVisible];
        updatedVisibliity[index] = !updatedVisibliity[index];
        return updatedVisibliity;
      });
    };

    const logOut = () => {
        googleLogout();
        clearAll();
        setProfile(null);
        navigate('/');
    };

    return (
        <body id="main">
            <div id="everything-box">
                <div id="left-side">
                    <div id="top-box">
                        <img src={titleSrc} alt="CASSET" id="title" />
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" className="russo-one-regular" id="create-button" 
                          onClick={() => (setShowCreatePlaylist(!showCreatePlaylist))}>create casset</button>
                        <button className="russo-one-regular" id="import-button"
                          onClick={() => (setShowUploadPlaylist(!showUploadPlaylist))}>import playlist</button>
                    </div>
                    <div id="middle-box" className="scrollable">
                    {playCasset && (
                      <PlayCasset onClose={() => setPlayCasset(false)} />
                    )}
                    {editCasset && (
                      <EditCasset playlistID={selectedPlaylistID} onClose={() => setEditCasset(false)} />
                    )}
                    {!playCasset && !editCasset && (
                      <div>
                        <div id='search-container'>
                          <input type='text' placeholder='&#x1F50D;&#xFE0E;&emsp;search cassets' id='search-bar' />
                        </div>
                        <div id="empty-cassets-box" className="cassettes-container">
                          {savedPlaylists.map((playlist, i) => (
                            <div key={i} className='cassette-image-div'>
                              <p className='cassette-title'>{playlist.playlist_name}</p>
                              <img
                                src={cassetteTemp}
                                alt="PLAYLIST"
                                onClick={() => toggleBoxVisbility(i)}
                                style={{ cursor: 'pointer' }}
                                className='cassette-img'
                              />
                              <Collapse in={boxVisibility[i]}>
                                <div className='cassette-under-box'>
                                  <Button onClick={() => {setEditCasset(true)
                                  setSelectedPlaylistID(playlist._id)}} className="cassette-button">Edit Cassette</Button>
                                  <Button onClick={() => setPlayCasset(true)} className="cassette-button">Play Cassette</Button>
                                </div>
                              </Collapse>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                    <div id="bottom-box">
                      {/* used to be for shared cassettes */}
                      
                    </div>
                </div>
                <div id="right-side">
                    <div id="account-menu">
                        {/* Display pfp, profile name, and logout button if user is logged in */}
                        
                        {profile && (
                            <div>
                                <div id="account-top">
                                  <img src={profileImage} alt="pfp" id="pfp"/>
                                  <div id="name-centre">
                                    <p className="russo-one-regular" id="name">{profile.name}</p>
                                  </div>
                                </div>
                                <div id="account-bottom">
                                  <button className="russo-one-regular" id="logout-main" onClick={logOut}>logout</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div id="friends-box">
                      <div id="friends-top">
                        <p className="russo-one-regular" id="friends">friends</p>
                        <img src={logoSrc} alt="logo" id="logo"/>
                      </div>
                      <div id="empty-friends-box">
                        <p>No friends yet :(</p>
                      </div>
                    </div>
                </div>
            </div>
            <footer>
              <img src={iconSrc} alt="icon" style={{maxWidth: "32px"}}/>
              &emsp;© 2024 CasSet&emsp;About&emsp;Privacy Policy&emsp;Contact
            </footer> 
            {/* Conditionally render the CreatePlaylist component based on the state */}
            {showCreatePlaylist && <CreatePlaylist onClose={() => (setShowCreatePlaylist(false))} />}
            {showUploadPlaylist && <FindPlaylist onClose={() => (setShowUploadPlaylist(false))}/>}
        </body>
    )
}

export default MainSite;
