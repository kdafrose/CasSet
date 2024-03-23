import React, {useState} from 'react';

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b"; 

export default function Holder() {
    const [refreshTokenSaved] = useState(() => {
        const storedRefresh = localStorage.getItem("refresh_token");
        return storedRefresh ? storedRefresh : null;
    });;

    const baseString = CLIENT_ID + ":" + CLIENT_SECRET;

    const requestBody = new URLSearchParams();
    requestBody.append('grant_type', 'refresh_token');
    requestBody.append('refresh_token', refreshTokenSaved);

    const refreshParams = {
        method: 'POST',
        headers: {
            'content-type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic ' + btoa(baseString),
        },
        body: requestBody.toString(),
    };

    async function refreshToken() {
        await fetch('https://accounts.spotify.com/api/token', refreshParams)
        .then(response => response.json())
        .then(data => {
            console.log("Did it work? Refreshing?");
            console.log(data);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenType");
            localStorage.removeItem("expiresIn");
            localStorage.removeItem("refresh_token");
      
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("tokenType", data.token_type);
            localStorage.setItem("expiresIn", data.expires_in);
            localStorage.setItem("refresh_token", data.refresh_token);
        })
    }

    return (
        <>
            <div>
                Nothing here for now....will be able to add songs to playlist in a bit
            </div>
            <button onClick= {refreshToken}>
                Refresh token!?
            </button>
        </>
    )
}