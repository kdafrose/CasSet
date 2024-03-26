// async function to fetch all songs within a playlist

async function fetchGetMultiSongs(playlistID){
    try {
    
        const response = await fetch('http://localhost:5000/songs/getMultiSongs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "profileID": playlistID }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const songs = await response.json();
        return songs;
    } catch (error) {
        console.log(error);
    }
}

export default fetchGetMultiSongs;