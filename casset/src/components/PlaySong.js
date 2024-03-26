import '../css/PlaySong.css';
import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import playImage from '../media/play.png';
import pauseImage from '../media/pause.png';
import prevImage from '../media/previous.png';
import nextImage from '../media/next.png';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

export default function PlaySong(props) {

    const { songURI, playlistURI} = props;

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [accessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;

    async function transferAuto(deviceSpecific){

        const transferParams = {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                'device_ids' : [deviceSpecific],
                'play' : true,
            }),
        }
    
        await fetch('https://api.spotify.com/v1/me/player', transferParams);
    
        console.log("Transferred? To: " + deviceSpecific);
    }

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);

                transferAuto(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };
    }, []);

    const handleChange = (event) => {
        player.setVolume(event.target.value / 100);
    }

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <div className="now-playing">
                            <img src={current_track.album.images[0].url} className="now-playing__cover" alt="Playlist Cover" />
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>
                                <div id=".btn-spotify">
                                    <button className="btn-spotify-prev" onClick={() => { player.previousTrack() }} >
                                        <img id="prev" src={prevImage} alt="&lt;&lt;"/>
                                    </button>

                                    <button className="btn-spotify-pp" onClick={() => { player.togglePlay() }} >
                                        { is_paused ? <img id="play" src={playImage} alt="&#x25B6;"/> : <img id="pause" src={pauseImage} alt="&#x23f8;"/> }
                                    </button>

                                    <button className="btn-spotify-next" onClick={() => { player.nextTrack() }} >
                                        <img id="next" src={nextImage} alt="&gt;&gt;"/>
                                    </button>
                                </div>
                        </div>
                        <div id="volume">
                            Volume
                        </div>
                        {/* <Form.Range id="volume-slider"
                            onChange={event => {player.setVolume((event.target.value) /100 )}}
                        /> */}
                        <Form.Range id="volume-slider"
                            onChange={handleChange}
                        />
                    </div>   
                </div>
            </>
        );
    }
}
