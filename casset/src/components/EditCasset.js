import '../css/EditCasset.css';
import { Button } from 'react-bootstrap';
// hardcoded images here:
import spotifyCover from '../media/spotifycover.jpg';
import tempCover from '../media/goatedmusic.png';
import artistImage from '../media/artistimage.png';
import artistImage2 from '../media/rina.JPG';

function EditCasset({ onClose }) {
    return (
        <div id="casset-edit">
            <div id="casset-side-box">
                <img src={spotifyCover} alt="spotify cover" id="spotify-cover"/>
                <p className="russo-one-regular" id="spotify-desc-title">description</p>
                <p id="spotify-desc">Lorem ipsum dolor ue s nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p>
                <div id="date-container">
                    <p className="russo-one-regular" id="date-created">date created:</p>
                    <p id="date">Mar 12, 2024</p>
                </div>
                <div id="share-button-div">
                    <button type="button" className="russo-one-regular" id="share-button">share</button>
                </div>
            </div>
            <div id="casset-songs">
                <div id="casset-songs-top">
                    <Button id="back-button" onClick={onClose}>go back</Button>
                    <p className="russo-one-regular" id="casset-songs-title">SONGS</p>
                </div>
                <div id="casset-songs-box-col" className="scrollable">
                    <div id="casset-songs-row">
                        <img src={tempCover} alt="temp cover" id="casset-cover"/>
                            <p className="russo-one-regular" id="casset-title">goatedmusic.</p>
                    </div>
                    <div id="casset-list-in-edit">
                        {/* Song Box HARD CODED FOR NOW*/}
                        <div className="song-box-info">
                            <p id="spotify-number" className="russo-one-regular">1</p>
                            <img src={artistImage} alt="artist image" id="spotify-artist-image"/>
                            <div>
                                <p id="spotify-songname-format"><strong>True Romance</strong></p>
                                <p id="spotify-artistname-format">PinkPantheress</p>
                                {/* <p id="spotify-albumname-format">Heaven Knows</p> */}
                            </div>
                            
                        </div>

                        <div className="song-box-info">
                        <p id="spotify-number" className="russo-one-regular">2</p>
                            <img src={artistImage2} alt="artist image" id="spotify-artist-image"/>
                            <div>
                                <p id="spotify-songname-format"><strong>Cyber Stockholm Syndrome</strong></p>
                                <p id="spotify-artistname-format">Rina Sawayama</p>
                                {/* <p id="spotify-albumname-format">Heaven Knows</p> */}
                            </div>
                            
                        </div>
                        <div className="song-box-info">
                            <p>Song 3</p>
                            
                        </div>
                        <div className="song-box-info">
                            <p>Song 3</p>
                            
                        </div>
                        <div className="song-box-info">
                            <p>Song 3</p>
                            
                        </div>
                        <div className="song-box-info">
                            <p>Song 3</p>
                            
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCasset;