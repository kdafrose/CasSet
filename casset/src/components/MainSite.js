import '../css/MainSite.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component
import FindPlaylist  from './FindPlaylist';
import logoSrc from '../media/casset_title.png';

function MainSite() {
    const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
    const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b"; 
    const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/casset";
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // State to toggle showing the create playlist form
    const [showUploadPlaylist, setShowUploadPlaylist] = useState(false); 
    const [accessToken] = useState(() => {
      const storedToken = localStorage.getItem("accessToken");
      return storedToken ? storedToken : null;
    });
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    function clearAll(){

      // THIS ENTIRE FUNCTION CHANGES WHEN DATABASE HAPPENS

      localStorage.removeItem("profile");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userSpotifyID")
      localStorage.removeItem("tokenType");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("refresh_token");

      return;
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

        const meParams = {
          method: 'GET',
          headers: {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + accessToken
          },
        };
      
        var waiting = await fetch('https://accounts.spotify.com/api/token', tokenExchangeParams)
          .then(response => response.json())
          .then(async data => {
      
            if(data.error === "invalid_grant"){
              return false;
            }

            // ALL OF THIS MOVES WHEN WE HAVE DATABASE CONNECTION
            clearAll();
      
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("tokenType", data.token_type);
            localStorage.setItem("expiresIn", data.expires_in);
            localStorage.setItem("refresh_token", data.refresh_token);

            await fetch('https://api.spotify.com/v1/me', meParams)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              localStorage.setItem("userSpotifyID", data.id);
          })
            
            return;
          })
      
        if (waiting === false){
          return false;
        }
      
        return waiting;
    }

    useEffect(() => {
        if (window.location.search) {
          tokenCall(window.location.search);
        }
        // CHANGE localStorage to database later...

        // Retrieve profile information from local storage
        const storedProfile = localStorage.getItem("profile");
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

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
                        <img src={logoSrc} alt="CASSET" id="title" />
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" id="import-button" 
                          onClick={() => (setShowCreatePlaylist(!showCreatePlaylist))}>Create Cassette </button>
                        <button id="import-button"
                          onClick={() => (setShowUploadPlaylist(!showUploadPlaylist))}>Choose an Existing Spotify Playlist</button>
                    </div>
                    <div id="middle-box">
                      <div id='search-container'>
                        <button type="submit" id="search-submit">&#x1F50D;&#xFE0E;</button>
                        <input type="text" placeholder="search cassets" id="search-bar"></input>
                      </div>
                      <div id="empty-cassette-box">
                        <p>No cassettes yet ;)</p>
                      </div>
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
                                <p>pfp here</p>
                                <p>{profile.name}</p>
                                <button onClick={logOut}>Log out</button>
                            </div>
                        )}
                    </div>
                    <div id="friends-box">
                        <p>friends here</p>
                    </div>
                </div>
            </div>
            <footer>
              &emsp;© 2024 CasSet&emsp;About&emsp;Privacy Policy&emsp;Contact
            </footer> 
            {/* Conditionally render the CreatePlaylist component based on the state */}
            {showCreatePlaylist && <CreatePlaylist onClose={() => (setShowCreatePlaylist(false))} />}
            {showUploadPlaylist && <FindPlaylist onClose={() => (setShowUploadPlaylist(false))}/>}
        </body>
    )
}

export default MainSite;
