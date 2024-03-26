import React from 'react';
import '../css/PlayCasset.css';
import { Button } from 'react-bootstrap';
import PlaySong from './PlaySong';
import titleSrc from '../media/casset_title_purple.png';
import logoSrc from '../media/casset.png';
import iconSrc from '../media/disket.png';

function PlayCasset({ onClose }) {
    
    return (
        <body id="main">
            <div id="everything-box">
                <div id="left-side">
                    <div id="top-box">
                        <img src={titleSrc} alt="CASSET" id="title" />
                        {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                        <button type="button" className="russo-one-regular" id="create-button">create casset</button>
                        <button className="russo-one-regular" id="import-button">import playlist</button>
                    </div>
                    <div id="middle-box" className="scrollable">
                        
                        {/* EDIT HERE!!! */}
                        <div id="casset-play-top">
                            <Button id="back" onClick={onClose}>go back</Button>
                            <p className="russo-one-regular" id="casset-title-play">goatedmusic.</p>
                        </div>
                        <div id="big-purple-container">
                            <div id="left-play-song">
                                <PlaySong/>
                            </div>
                            <div id="right-cassetandnote">
                                <div id="show-note">
                                    {/* NOTE HEREEEEEEEEEE */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="bottom-box">
                      {/* used to be for shared cassettes */}
                      
                    </div>
                </div>
                <div id="right-side">
                    <div id="account-menu">
                    
                    </div>
                    <div id="friends-box">
                      <div id="friends-top">
                        <p className="russo-one-regular" id="friends">friends</p>
                        <img src={logoSrc} alt="logo" id="logo"/>
                      </div>
                      <div id="empty-friends-box">
                        <p>No friends yet :,(</p>
                      </div>
                    </div>
                </div>
            </div>
            <footer>
              <img src={iconSrc} alt="icon" style={{maxWidth: "32px"}}/>
              &emsp;© 2024 CasSet&emsp;About&emsp;Privacy Policy&emsp;Contact
            </footer> 
        </body>
    )
}

export default PlayCasset