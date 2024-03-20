import React, { useEffect } from "react";
import '../App.css';

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b"; 
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
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

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/

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

  var waiting = await fetch('https://accounts.spotify.com/api/token', tokenExchangeParams)
    .then(response => response.json())
    .then(data => {

      if(data.error === "invalid_grant"){
        return false;
      }
      console.log("Below is from the fetch of the token");
      console.log(data);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("refresh_token");

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("tokenType", data.token_type);
      localStorage.setItem("expiresIn", data.expires_in);
      localStorage.setItem("refresh_token", data.refresh_token);
      return;
    })

  if (waiting === false){
    return false;
  }

  return waiting;
}

const SpotifyConnect = () => {
  // Css for Spotify connect button
  
  useEffect(() => {
    if (window.location.search) {
      const returnedValues= tokenCall(window.location.search);
    }
    // CHANGE localStorage to database later...
  }, []);

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true`;
  };

  return (
    <div className="login-auth-button-container">
      <button id="SpotifyButton" onClick={handleLogin}>Authenticate</button>
    </div>
  );
};

export default SpotifyConnect;