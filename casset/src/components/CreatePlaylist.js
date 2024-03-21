import {useState} from 'react'
import {Container, InputGroup, FormControl, Button, Card} from 'react-bootstrap'
import AddSong from './AddSong';

// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

export default function CreatePlaylist({ onClose }) {
    const [playlistName, setPlaylistName] = useState("Tester Playlist Name");
    const [playlistDescription, setPLaylistDescription] = useState("Made with CasSet");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });;
    const [savedUserSpotifyID] = useState(() => {
        const storedSpotifyID = localStorage.getItem("userSpotifyID");
        return storedSpotifyID ? storedSpotifyID : null;
    })
    const [playlistMade, setPlaylistMade] = useState(true);
    const [songsToAdd, setSongsToAdd] = useState([])

    async function makePlaylist() {
        if(playlistName.trim() === ""){
            console.log("Please input a name for your playlist.");
            return;
        }

        var playlistParams = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
            body: JSON.stringify({ 
                "name": playlistName,
                "description": playlistDescription,
                "public" : true,
            })
        };
        
        await fetch('https://api.spotify.com/v1/users/' + savedUserSpotifyID + '/playlists', playlistParams)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })

        setPlaylistMade(true);
        
    }

    function updateSongList(song) {
        songsToAdd.push(song);

        console.log(songsToAdd);
    }

    function removeSong(goodbyeSong) {
        setSongsToAdd(prevList => prevList.filter(song => song.id !== goodbyeSong.id));
    } 

    const handleClose = () => {
        setPlaylistName("");
        setAccessToken(""); // Reset access token when form is closed
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className="overlay">
            <div className="form-container">
                {playlistMade === false ? (
                    <form className="create-playlist-form">
                        <button className="close-button" onClick={handleClose}>X</button>
                        <Container>
                            <InputGroup className='mb-3' size='lg'>
                                <FormControl
                                    placeholder="Playlist Name"
                                    type="input"
                                    onKeyDown={event => {
                                        if(event.key === "Enter"){
                                        makePlaylist();
                                        }
                                    }}
                                    onChange={event => {
                                        setPlaylistName(event.target.value);
                                    }}
                                />
                                <Button onClick={makePlaylist}>
                                    Make
                                </Button>
                            </InputGroup>
                            <FormControl 
                                placeholder="Enter description here" 
                                type="input"
                                onChange={event =>{
                                    setPLaylistDescription(event.target.value);
                                }}
                                >
                            </FormControl>
                        </Container>
                    </form>
                ) : (
                    <>
                        <form className="new-playlist-songs">
                            <div id="new-playlist-div">
                                <button className="close-button" onClick={handleClose}>X</button>
                                <h1 id="newly-playlist-title">{playlistName}</h1>
                            </div>
                            <AddSong onSongUpdate={updateSongList}/>
                            <div id="songs-added">
                                {songsToAdd.map((song) => {
                                    //console.log(song)
                                    return (
                                        <div className='song-add-display'> 
                                            <Card key={song.id}>
                                            <Card.Img src={song.album.images[0].url}/>
                                            <Card.Body>
                                                <Card.Title>{song.name}</Card.Title>
                                                <Card.Subtitle>{song.artists[0].name}</Card.Subtitle>
                                            </Card.Body>
                                            <Button onClick={() => {removeSong(song)}}>X</Button>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
                        </form>
                    </>
                )
                }
            </div>
        </div>
    )
}