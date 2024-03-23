import '../css/MainSite.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component
import titleSrc from '../media/casset_title_purple.png';
import pfpSrc from '../media/pfp.JPG';
import logoSrc from '../media/casset.png';

function MainSite() {
    const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
    const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b"; 
    const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/casset";
    const SPACE_DELIMITER = "%20";
    const SCOPES = [
      "user-read-currently-playing",
      "user-read-playback-state",
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-public",
      "playlist-modify-private",
      "streaming",
      "user-read-private",
    ];
    const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // State to toggle showing the create playlist form
    const [accessToken] = useState(() => {
      const storedToken = localStorage.getItem("accessToken");
      console.log("Access Token: " + storedToken);
      return storedToken ? storedToken : null;
    });
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    function clearAll(){
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
            console.log("Below is from the fetch of the token: this is mainsite");
            console.log(data);

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
        navigate('/')
    };

    const toggleCreatePlaylist = () => {
        setShowCreatePlaylist(!showCreatePlaylist);
    };

    const closeCreatePlaylist = () => {
        setShowCreatePlaylist(false);
    };

    return (
        <body id="main">
            <div id="everything-box">
                <div id="left-side">
                    <div id="top-box">
                        <img src={titleSrc} alt="CASSET" id="title" />
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" class="russo-one-regular" id="create-button" onClick={toggleCreatePlaylist}>create casset</button>
                        <button type="button" class="russo-one-regular" id="import-button">import playlist</button>
                    </div>
                    <div id="middle-box">
                      <div id='search-container'>
                        <input type='text' placeholder='&#x1F50D;&#xFE0E;&emsp;search cassets' id='search-bar' />
                      </div>
                      <div id="empty-cassets-box">
                        <p>No cassets yet ;)</p>
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
                                <div id="account-top">
                                  <img src={pfpSrc} alt="pfp" id="pfp"/>
                                  <div id="name-centre">
                                    <p class="russo-one-regular" id="name">{profile.name}</p>
                                  </div>
                                </div>
                                <div id="account-bottom">
                                  <button class="russo-one-regular" id="logout-main" onClick={logOut}>logout</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div id="friends-box">
                      <div id="friends-top">
                        <p class="russo-one-regular" id="friends">friends</p>
                        <img src={logoSrc} alt="logo" id="logo"/>
                      </div>
                      <div id="empty-friends-box">
                        <p>No friends yet :(</p>
                      </div>
                    </div>
                </div>
            </div>
            <footer>
              © 2024 CasSet&emsp;About&emsp;Privacy Policy&emsp;Contact
            </footer> 
            {/* Conditionally render the CreatePlaylist component based on the state */}
            {showCreatePlaylist && <CreatePlaylist onClose={closeCreatePlaylist} />}
        </body>
    )
}

export default MainSite;
