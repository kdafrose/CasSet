import React, { useEffect } from "react";
import '../css/Home.css';

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/casset";
const SPACE_DELIMITER = "%20"; 
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "streaming",
  "user-read-private",
  "user-read-email",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/

const SpotifyConnect = () => {

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true`;
  };

  return (
    <div className="login-auth-button-container">
      <button class="russo-one-regular" id="SpotifyButton" onClick={handleLogin}>Authenticate</button>
    </div>
  );
};

export default SpotifyConnect;