// adding a new friend in db

async function addNewFriend(newFriendName, user_name, user_email){
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

export default addNewFriend;