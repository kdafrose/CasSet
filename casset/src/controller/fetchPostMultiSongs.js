// async function to call py function to post multiple songs to a playlist

async function fetchPostMultiSongs(songsDocs){
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
    .catch(error => {
        console.error('Error:', error);
    });
}

export default fetchPostMultiSongs;