// CONTROLLER FILES FOR ALL DATABASE INTERACTIONS FOR FRIENDS 

export async function addSharedCasset(user_name, user_email, friend_name, sharedPlaylistID){
    fetch('http://localhost:5000/friends/addNewSharedCasset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user_name":user_name, "user_email":user_email, "friend_name":friend_name, "newSharedPlaylistID":sharedPlaylistID}) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function removeFriend(friend_name, user_name, user_email){
    fetch('http://localhost:5000/friends/removeFriend', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"friend_name":friend_name, "user_name":user_name, "user_email":user_email}) // Use profileData instead of params
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

export const fetchAddedFriends = async () => {
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

export async function addNewFriend(newFriendName, user_name, user_email){
    fetch('http://localhost:5000/friends/addFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user_name":user_name, "friend_name":newFriendName, "user_email":user_email}) // Use profileData instead of params
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}