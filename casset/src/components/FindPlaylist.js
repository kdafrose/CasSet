import {useState, useEffect} from 'react'
import {Container, Button, Row, Spinner, Card, InputGroup, Form} from 'react-bootstrap'
import '../css/FindPlaylist.css';
import fetchPostPlaylist from '../controller/fetchPostPlaylist';

export default function FindPlaylist({onClose}) {
    const [accessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });;
    const [playlists, setPlaylists] = useState([]);
    const [savedUserSpotifyID] = useState(() => {
        const storedSpotifyID = localStorage.getItem("userSpotifyID");
        return storedSpotifyID ? storedSpotifyID : null;
    })
    const [importSpotifyURL, setImportSpotifyURL] = useState([]);

    var playlistParams = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + accessToken
        },
    };

    async function searchForPlaylists(){
        await fetch('https://api.spotify.com/v1/users/' + savedUserSpotifyID + '/playlists?limit=40', playlistParams)
        .then(response => response.json())
        .then(data => {
            setPlaylists(data.items);
        })
    }

    async function importPlaylist() {
        const lastPart = importSpotifyURL.split("/playlist/").pop();

        await fetch('https://api.spotify.com/v1/playlists/' + lastPart, playlistParams)
            .then(response => response.json())
            .then(data => {
                const playlistInfo = {
                    "_id": data.id,
                    "playlist_name": data.name, 
                    "sharing_link": data.external_urls.spotify,
                };

                handlePlaylistChoice(playlistInfo);
            })
    }

    useEffect(() => {

        searchForPlaylists();
    }, []);

    async function handlePlaylistChoice(data) {
        const profile = JSON.parse(localStorage.getItem('profile'));
        const playlistData = {
            "_id": data['_id'],
            "playlist_name": data['playlist_name'],
            "owner_name":profile.name,
            "email": profile.email,
            "sharing_link":data['sharing_link'],
            "note": "fill in later",
        }

        fetchPostPlaylist(playlistData);
        onClose();
    }

    const handleClose = () => {
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className='overlay-find'>
            <div className="form-container-find">
                <form className="find-playlist-form">
                    <button className="close-button" onClick={handleClose}>X</button>
                    {playlists.length !== 0 ? (
                        <>
                            <Container id="import-container">
                                <InputGroup className='mb-3' size='lg'>
                                    <Form.Control
                                        placeholder="Enter a Spotify Playlist URL to Import"
                                        type="input"
                                        onKeyDown={event => {
                                            if(event.key === "Enter"){
                                                importPlaylist();
                                            }
                                        }}
                                        onChange={event => {
                                            setImportSpotifyURL(event.target.value);
                                        }}
                                    />
                                    <Button onClick={importPlaylist}>
                                        Import
                                    </Button>
                                </InputGroup>
                            </Container>
                            <h3 className="russo-one-regular" style={{textAlign: 'center'}}> Or Import One of Your Own: </h3>
                            <Container>
                                <Row className="mx-2 row row-cols-2">
                                    {playlists.map( (playlist, i) => {
                                    return (
                                        <Card className='d-flex flex-row' key={playlist.name}>
                                            <Card.Img src={playlist.images?.[0]?.url} style={{ height: '150px', width: '150px', objectFit:'cover'}}/>
                                            <Card.Body className='flex-grow-1' style={{width:'300px'}}>
                                                <Card.Title>{playlist.name}</Card.Title>
                                                <Card.Subtitle>{playlist.description}</Card.Subtitle>
                                            </Card.Body>
                                        <Button  
                                            style={{height:'150px', width: '150px', objectFit:'cover'}} 
                                            onClick={() => {
                                            // Change this to hold the selected playlistID with database connection
                                            localStorage.removeItem("playlistID");
                                            localStorage.setItem("playlistID", playlist.id);

                                            const playlistInfo = {
                                                "_id": playlist.id,
                                                "playlist_name": playlist.name, 
                                                "sharing_link":playlist.external_urls.spotify,
                                            }
                                        
                                            handlePlaylistChoice(playlistInfo);
                                        }}>
                                        Select playlist
                                    </Button>
                                    </Card>
                                    )
                                })}
                            </Row>
                        </Container>
                    </>
                    ) : (
                        <Container className="loading-container">
                            <Spinner 
                                id="spin"
                                animation="border" 
                                variant="primary" 
                            />
                        </Container>
                    )
                    }
                </form>
            </div>
        </div>
    )
}