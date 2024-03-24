const fetchPlaylists = async () => {
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

export default fetchPlaylists;