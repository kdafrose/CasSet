const fetchUsers = async () => {
    try {
        const profileInfo = JSON.parse(localStorage.getItem('profile'));
        console.log(profileInfo);
        const response = await fetch('http://localhost:5000/users/searchUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": profileInfo['email'] }), 
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const foundUser = await response.json();
        return foundUser;
    } catch (error) {
        console.log(error);
    }
};

export default fetchUsers;