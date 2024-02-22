import React, { useEffect } from "react";
import styled from 'styled-components';

const CLIENT_ID = "21fea0db3247431798d002572894627c"; 
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000";
const SPACE_DELIMITER = "%20";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-read-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

/* 
http://localhost:3000/webapp#access_token=ABCqxL4Y&token_type=Bearer&expires_in=3600
*/
const getReturnedParamsFromSpotifyAuth = (hash) => {
  const stringAfterHashtag = hash.substring(1);
  const paramsInUrl = stringAfterHashtag.split("&");
  const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
    console.log(currentValue);
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});

  return paramsSplitUp;
};

const SpotifyConnect = () => {
  // Css for Spotify connect button
  const SpotifyButton = styled.button`
   background-color: #fff;
   color: rgba(0, 0, 0, 0.54);
   border: 1px solid rgba(0, 0, 0, 0.12);
   border-radius: 30px;
   font-size: 14px;
   font-weight: 500;
   padding: 0.8rem 1rem;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
 
   &:hover {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
    transition: box-shadow 0.2s ease-in-out;
   }
   
   `;
  
  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } =
        getReturnedParamsFromSpotifyAuth(window.location.hash);
        
    // CHANGE localStorage to database later...
      localStorage.clear();

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
      <SpotifyButton onClick={handleLogin}>Connect with Spotify</SpotifyButton>
    </div>
  );
};

export default SpotifyConnect;