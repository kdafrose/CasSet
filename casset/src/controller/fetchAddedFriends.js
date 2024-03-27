const fetchAddedFriends = async () => {
    try {
        const profileInfo = JSON.parse(localStorage.getItem('profile'));
        console.log(profileInfo);
        const response = await fetch('http://localhost:5000/friends/findAddedFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": profileInfo['email'], "name":profileInfo['name'] }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const friends = await response.json();
        return friends;
    } catch (error) {
        console.log(error);
    }
}

export default fetchAddedFriends;