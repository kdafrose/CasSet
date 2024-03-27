// async function that deletes playlist in db

async function deletePlaylist(playlistID){
    fetch('http://localhost:5000/playlist/deletePlaylist', {
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

export default deletePlaylist;