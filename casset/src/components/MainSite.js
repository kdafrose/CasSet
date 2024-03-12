import './MainSite.css';
import React, { useState, useEffect } from 'react';
import CreatePlaylist from './CreatePlaylist'; // Import the CreatePlaylist component

function MainSite() {
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // State to toggle showing the create playlist form

    return (
        <body id="main">
            <div id="everything-box">
                <div id="left-side">
                    <div id="top-box">
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" id="import-button" onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}>create playlist</button>
                        <h1>CasSet</h1>
                    </div>
                    <div id="middle-box">
                        <p>No cassettes yet ;)</p>
                    </div>
                    <div id="bottom-box">
                        <h2>Groups</h2>
                        <div id="groups-box">
                            <p>groups here</p>
                        </div>
                    </div>
                </div>
                <div id="right-side">
                    <div id="account-menu">
                        <p>icon here</p>
                    </div>
                    <div id="friends-box">
                        <p>friends here</p>
                    </div>
                </div>
            </div>
            {/* Conditionally render the CreatePlaylist component based on the state */}
            {showCreatePlaylist && <CreatePlaylist />}
        </body>
    )
}

export default MainSite;
