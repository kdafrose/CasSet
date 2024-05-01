// async function to delete multiple songs in a playlist

export async function deleteSongs(playlistID){
    fetch('http://localhost:5000/songs/deleteMultipleSongs', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"playlistID":playlistID}) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .then(() => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function fetchPostMultiSongs(songsDocs){
    fetch('http://localhost:5000/songs/postMultipleSongs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(songsDocs) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .then(() => {
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function fetchGetMultiSongs(playlistID){
    try {
    
        const response = await fetch('http://localhost:5000/songs/getMultiSongs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "playlistID": playlistID }), 
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

export async function editSongNote(songID, playlistID, new_note){
    try {
    
        const response = await fetch('http://localhost:5000/songs/editNote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "songID":songID, "playlistID": playlistID, "new_note":new_note }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const newNote = await response.json();
        return newNote['result'];
    } catch (error) {
        console.log(error);
    }

}