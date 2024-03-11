import React, {useState, useEffect} from 'react';

export default function AddSong() {

    const [accessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;

    const meParams = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + accessToken
        },
    };


    // HOLY THIS WORKS
    async function getMe() {
        var playlistCreate = await fetch('https://api.spotify.com/v1/me', meParams)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
    }

    return (
        <>
            <div>
                Nothing here for now....will be able to add songs to playlist in a bit
                <button onClick= {getMe}>
                    HE HE
                </button>
            </div>
        </>
    )
}