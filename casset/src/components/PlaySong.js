import React, {useState, useEffect} from 'react';
import {Form, Button} from 'react-bootstrap';
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

export default function PlaySong({ playingID, onNext, onPrev, closer }) {

    // const { songURI, playlistURI} = props; comment out for now until we can use it

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [accessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
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
        playlistTransfer(deviceSpecific);
    }

    async function playlistTransfer(selectDevice){

        const playlistURIPlay = "spotify:playlist:" + playingID;

        const transferParams = {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                'context_uri' : playlistURIPlay,
                'offset': {
                    'position':0
                },
                "position_ms":0
            }),
        };
    
        await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + selectDevice, transferParams);
    }

    function disconnectPlayer(){
        player.pause();
        player.disconnect();
        player.removeListener('ready');
        player.removeListener('not_ready');
        player.removeListener('player_state_changed');

        closer();
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

            setPlayer(player);

            // Cleanup function

        };
    }, []);

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
                <div id="casset-play-top">
                    <Button id="back" onClick={disconnectPlayer}>go back</Button>
                    <p className="russo-one-regular" id="casset-title-play">goatedmusic.</p>
                </div>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>
                                <div id=".btn-spotify">
                                    <button className="btn-spotify-prev" onClick={() => { player.previousTrack(); onPrev(); }} >
                                        <img id="prev" src={prevImage} alt="&lt;&lt;"/>
                                    </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                                    <button className="btn-spotify-next" onClick={() => { player.nextTrack(); onNext(); }} >
                                        <img id="next" src={nextImage} alt="&gt;&gt;"/>
                                    </button>
                                </div>
                        </div>
                        <Form.Label>
                            Volume
                        </Form.Label>
                        <Form.Range
                            onChange={event => {player.setVolume((event.target.value) /100 )}}
                        />
                    </div>
                </div>
            </>
        );
    }
}
