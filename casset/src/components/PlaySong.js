import '../css/PlaySong.css';
import React, { useState, useEffect } from 'react';
import prevImage from '../media/previous.png';
import nextImage from '../media/next.png';
import playImg from '../media/play.png';
import pauseImg from '../media/pause.png';

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

export let playerInstance;

// Cleanup function
export function DisconnectPlayer(player, closer){
    player.pause();
    player.removeListener('ready');
    player.removeListener('not_ready');
    player.removeListener('player_state_changed');
    player.disconnect();

    closer();
}

export default function PlaySong({ playingData, onNext, onPrev }) {

    const [is_paused, setPaused] = useState(true);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [accessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });;
    const [position, setPosition] = useState(0); // Track position in milliseconds
    const [duration, setDuration] = useState(0); // Track duration in milliseconds

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
        turnOffShuffle(deviceSpecific);
    }

    async function playlistTransfer(selectDevice){

        const playlistURIPlay = "spotify:playlist:" + playingData.playlistID;
        console.log("New playlistID: " + playingData.playlistID);

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

    async function turnOffShuffle(deviceChosen){
        const shuffleParams = {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
        };
    
        await fetch('https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=' + deviceChosen, shuffleParams);
        playlistTransfer(deviceChosen);
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
                setPosition(state.position);
                setDuration(state.duration);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
            }));

            player.connect();

            setPlayer(player);

            playerInstance = player;
        };
    }, []);

    useEffect(() => {
        const updateProgress = setInterval(() => {
            player.getCurrentState().then(state => {
                if (state) {
                    setPosition(state.position);
                    setDuration(state.duration);
                }
            });
        }, 1000); // Update progress every second
    
        return () => clearInterval(updateProgress);
    }, [player]);

return (
        <>
            {is_active ? (
                <div className="container">
                    <div className="main-wrapper">
                        <div className="now-playing">
                            <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>
                            <div id="progress-bar-container">
                                <div id="timestamp">{formatTime(position)}</div>
                                <input type="range" id="progress-slider" oninput={updateProgress()}
                                    value={(position / duration) * 100 || 0}
                                    onChange={event => {
                                        const newPosition = (event.target.value * duration) / 100;
                                        player.seek(newPosition);
                                    }}
                                />
                                <div id="total-duration">{formatTime(duration)}</div>
                            </div>
                            <div id=".btn-spotify">
                                <button className="btn-spotify-prev" onClick={() => { player.previousTrack(); console.log("currentID (PlaySong):", current_track.id); 
                                    setTimeout(() => {
                                        onPrev(); 
                                    }, 500); // Delay execution by 500 milliseconds
                                }} >
                                    <img id="prev" src={prevImage} alt="&lt;&lt;" />
                                </button>

                                <button className="btn-spotify-pp" onClick={() => { player.togglePlay() }} >
                                    {is_paused ? <img id="play" src={playImg} alt="&#x25B6;" /> : <img id="pause" src={pauseImg} alt="&#x23f8;" />}
                                </button>

                                <button className="btn-spotify-next" onClick={() => { player.nextTrack(); onNext(); }} >
                                    <img id="next" src={nextImage} alt="&gt;&gt;" />
                                </button>
                            </div>
                        </div>
                        <div id="volume">
                            Volume
                            <div>
                                <input type="range" id="volume-slider"
                                    onChange={event => { player.setVolume((event.target.value) / 100) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container">
                    <div className="main-wrapper">
                        <b className="transfer-instance"> Transferring the instance to CasSet... </b>
                    </div>
                </div>
            )}
        </>
    );
}

// Helper function to format time in milliseconds to mm:ss format
function formatTime(timeInMilliseconds) {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Helper function to update the color of progress slider
function updateProgress() {
    if (document.getElementById("progress-slider")) {
        const slider = document.getElementById("progress-slider");
        const sliderValue = slider.value;
        slider.style.background = `linear-gradient(to right, #DD9591 5%, #DD9591 ${sliderValue}%, #E8D0CB ${sliderValue}%, #E8D0CB 95%)`;
    }
}
