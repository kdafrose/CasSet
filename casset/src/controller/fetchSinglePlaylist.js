// async function to fetch playlist for EditCasset.js

async function fetchCasset(playlistID){
    try {
    
        const response = await fetch('http://localhost:5000/playlist/fetchPlaylistDocument', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "_id": playlistID }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const playlist = await response.json();
        return playlist;
    } catch (error) {
        console.log(error);
    }
}

export default fetchCasset;