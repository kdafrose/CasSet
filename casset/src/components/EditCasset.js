import '../css/EditCasset.css';
import '../css/MainSite.css';
import titleSrc from '../media/casset_title_purple.png';
import spotifyCover from '../media/spotifycover.jpg';
import tempCover from '../media/goatedmusic.png';

function EditCasset() {
    return (
        <div id="everything-box">
            <div id="left-side">
                <div id="top-box">
                    <img src={titleSrc} alt="CASSET" id="title" />
                    {/* When the button is clicked, toggle the state to show/hide the create playlist form */}
                    <button type="button" className="russo-one-regular" id="create-button">create casset</button>
                    <button className="russo-one-regular" id="import-button">import playlist</button>
                </div>
                <div id="middle-box"> {/* ADDING STUFF HERE */}
                    <div id="casset-edit">
                        <div id="casset-side-box">
                            <img src={spotifyCover} alt="spotify cover" id="spotify-cover"/>
                            <p className="russo-one-regular" id="spotify-desc-title">description</p>
                            <p id="spotify-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <button type="button" className="russo-one-regular" id="share-button">share</button>
                        </div>
                        <div id="casset-songs">
                            <p className="russo-one-regular" id="casset-songs-title">SONGS</p>
                            <div id="casset-songs-box">
                                <img src={tempCover} alt="temp cover" id="casset-cover"/>
                                <p className="russo-one-regular" id="casset-title">goatedmusic.</p>
                                <div id="casset-list">
                                {/* TO-DO */}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="bottom-box">
                </div>
            </div>
            <div id="right-side">
                <div id="account-menu">
                </div>
                <div id="friends-box">
                </div>
            </div>
        </div>
    )
}

export default EditCasset;