import {useState} from 'react'
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap'

// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

export default function CreatePlaylist({ onClose }) {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPLaylistDescription] = useState("Made with CasSet");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;
    const [savedUserSpotifyID] = useState(() => {
        const storedSpotifyID = localStorage.getItem("userSpotifyID");
        return storedSpotifyID ? storedSpotifyID : null;
    })

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
    }

    const handleClose = () => {
        setPlaylistName("");
        setAccessToken(""); // Reset access token when form is closed
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className="overlay">
            <div className="form-container">
                <form className="create-playlist-form">
                    <button id="close-button" onClick={handleClose}>X</button>
                    <Container>
                        <InputGroup className='mb-3' size='lg'>
                            <FormControl
                                placeholder="Playlist Name"
                                type="input"
                                onClick={event => {
                                    if(event.key === "Enter"){
                                    makePlaylist();
                                    }
                                }}
                                onChange={event => {
                                    setPlaylistName(event.target.value);
                                }}
                            />
                            <Button onClick={makePlaylist}>
                                Make!
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
            </div>
        </div>
    )
}