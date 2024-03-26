
async function fetchPostPlaylist(playlistData){
    fetch('http://localhost:5000/playlist/postNewPlaylist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistData) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export default fetchPostPlaylist;