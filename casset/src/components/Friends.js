import React, { useState } from 'react';
import '../css/Friends.css';
import {fetchUsers} from '../controller/usersController';
import {removeFriend,addNewFriend } from '../controller/friendsController';

export default function Friends({ friends, setFriends }) {
    const [showAddFriendForm, setShowAddFriendForm] = useState(false);
    const [email, setEmail] = useState('');    
    const [selectedFriend, setSelectedFriend] = useState(null);
    const profileData = JSON.parse(localStorage.getItem('profile'))

    const handleAddFriend = () => {
        // Check the database for the email and add friend if it's valid 
        // not the users own and exists in users (with database later)
        console.log("Checking database for email:", email);
        if(email !== profileData['email']){
            fetchUsers(email)
            .then(data =>{
                if(data){
                    // shows on UI
                    if(!friends.includes(data['name'])){
                        setFriends(alreadyFriends => [...alreadyFriends, data['name']])
                        window.alert('Friend added successfully!');
                    }
                    else{
                        window.alert('Already friends!');
                    }
                    // Adds friend to backend, takes care of both adding if not in db, and not add if already friends
                    addNewFriend(data['name'], profileData['name'], profileData['email'])
                }
                else{
                    window.alert("Email not found!")
                }
            })   
        }
        else{
            window.alert("Can't add yourself silly!");
        }

        // Reset the form after adding friend

        setEmail('');
        setShowAddFriendForm(false);
    };

    const handleCancelAddFriend = () => {
        // Reset the form and hide it when cancel is clicked
        setEmail('');
        setShowAddFriendForm(false);
    };

    const handleRemoveFriend = (friend) => {
        const confirmation = window.confirm(`Are you sure you want to remove ${friend}?`);
        if (confirmation) {
            // Handle friend removal here
            console.log(`${friend} removed.`);
            
            // BUG???
            // Call playlists with friends to change playlists attribute to false
            removeFriend(friend, profileData['name'], profileData['email']);

            // Filter out the friend to be removed from the friends list
            const updatedFriends = friends.filter(f => f !== friend);
            setFriends(updatedFriends);
            setSelectedFriend(null);
        }
        setSelectedFriend(null); // reset selected friend after removal
    };

    return (
        <div id="friends-bottom">
            <button 
                type="button" 
                className="russo-one-regular" 
                id="add-friends-button"
                onClick={() => setShowAddFriendForm(true)}
            >
                <b>&#x2b;</b> add friends
            </button>
            {showAddFriendForm && (
                <div id="add-friend-form">
                    <div id="add-friend-input">
                        <input
                            type="email"
                            placeholder="type email and click enter"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div id="add-friend-buttons">
                        <button className="russo-one-regular" id="enter-friends-button" onClick={handleAddFriend}>enter</button>
                        <button className="russo-one-regular" id="cancel-friends-button" onClick={handleCancelAddFriend}>cancel</button>
                    </div>
                </div>
            )}
            {friends.length > 0 ? (
                <div id="friends-list">
                    {/* Friends list rendered here (with database later) */}
                    {friends.map((friend, index) => (
                        <div key={index} className="russo-one-regular" id="friends-names-box">
                            <button id="friends-names" onClick={() => setSelectedFriend(selectedFriend === friend ? null : friend)}>
                                {friend}
                            </button>
                            {selectedFriend === friend && (
                                <div id="remove-friends-box">
                                    <button id="remove-friends-button" onClick={() => handleRemoveFriend(friend)}>remove</button>
                                </div>
                            )}  
                        </div>
                    ))}
                </div>
            ) : (
                <div id="empty-friends-box">
                    <p>No friends yet :(</p>
                </div>
            )} 
        </div>
    )
}