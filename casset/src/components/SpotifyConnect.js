import React, { useEffect } from "react";
import '../App.css';

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe"; 
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    //console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const SpotifyConnect = () => {
  // Css for Spotify connect button
  
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
        
    // CHANGE localStorage to database later...
      //localStorage.clear();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("expiresIn");

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
  });

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  return (
    <div>
      <button id="SpotifyButton" onClick={handleLogin}>Connect with Spotify</button>
    </div>
  );
};

export default SpotifyConnect;