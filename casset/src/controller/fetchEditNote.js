// async function to edit the notes of the song

async function editSongNote(songID, playlistID, new_note){
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

export default editSongNote;