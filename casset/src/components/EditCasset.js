import '../css/EditCasset.css';
import { Button } from 'react-bootstrap';
import titleSrc from '../media/casset_title_purple.png';
import spotifyCover from '../media/spotifycover.jpg';
import tempCover from '../media/goatedmusic.png';

function EditCasset({ onClose }) {
    return (
        <div id="casset-edit">
            <div id="casset-side-box">
                <img src={spotifyCover} alt="spotify cover" id="spotify-cover"/>
                <p className="russo-one-regular" id="spotify-desc-title">description</p>
                <p id="spotify-desc">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.</p>
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
                <div id="casset-songs-box-col">
                    <div id="casset-songs-row">
                        <img src={tempCover} alt="temp cover" id="casset-cover"/>
                            <p className="russo-one-regular" id="casset-title">goatedmusic.</p>
                    </div>
                    <div id="casset-list">
                        {/* TO-DO */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCasset;