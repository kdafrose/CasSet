// removing friend from database

async function removeFriend(friend_name, user_name, user_email){
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

export default removeFriend;