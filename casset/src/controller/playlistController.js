// async function that deletes playlist in db

export async function deletePlaylist(playlistID){
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

export async function fetchPostPlaylist(playlistData, callback){
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

export async function fetchCasset(playlistID){
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

export const fetchPlaylists = async () => {
    try {
        const profileInfo = JSON.parse(localStorage.getItem('profile'));
        console.log(profileInfo);
        const response = await fetch('http://localhost:5000/playlist/fetchMultiPlaylistDocuments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": profileInfo['email'], "name":profileInfo['name'] }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchSharedPlaylists = async (user_name, user_email) => {
    try {
        const response = await fetch('http://localhost:5000/playlist/getSharedPlaylists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"user_name":user_name, "user_email":user_email}), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const sharedCassets = await response.json();
        return sharedCassets;
    } catch (error) {
        console.log(error);
    }
}

export async function postSharedPlaylist(playlistID){
    fetch('http://localhost:5000/playlist/postSharedPlaylist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"playlistID":playlistID}) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

