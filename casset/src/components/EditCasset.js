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
                <p id="spotify-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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