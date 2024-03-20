import '../css/MainSite.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component
import FindPlaylist  from './FindPlaylist';

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
    const [showUploadPlaylist, setShowUploadPlaylist] = useState(false); 
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

    const toggleUploadPlaylist = () => {
      setShowUploadPlaylist(!showUploadPlaylist);
    };

    const closeUploadPlaylist = () => {
      setShowUploadPlaylist(false);
    };

    return (
        <body id="main">
            <div id="everything-box">
                <div id="left-side">
                    <div id="top-box">
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" id="import-button" onClick={toggleCreatePlaylist}>create playlist</button>
                        <h1>CasSet</h1>
                    </div>
                    <div id="middle-box">
                        <p>No cassettes yet ;)</p>
                    </div>
                    <div id="bottom-box">
                        <h2>Groups</h2>
                        <div id="groups-box">
                            <p>groups here</p>
                        </div>
                    </div>
                </div>
                <div id="right-side">
                    <div id="account-menu">
                        <p>icon here</p>
                        <div id="account-menu">
                            {/* Display profile name and logout button if user is logged in */}
                            {profile && (
                                <div>
                                    <p>{profile.name}</p>
                                    <button onClick={logOut}>Log out</button>
                                    <button onClick={toggleUploadPlaylist}>Choose an Existing Spotify Playlist</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div id="friends-box">
                        <p>friends here</p>
                    </div>
                </div>
            </div>
            {/* Conditionally render the CreatePlaylist component based on the state */}
            {showCreatePlaylist && <CreatePlaylist onClose={closeCreatePlaylist} />}
            {showUploadPlaylist && <FindPlaylist onClose={closeUploadPlaylist}/>}
        </body>
    )
}

export default MainSite;
