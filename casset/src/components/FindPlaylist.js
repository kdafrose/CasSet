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

    useEffect(() => {

        searchForPlaylists();
    }, []);

    async function handlePlaylistChoice(data) {
        const profile = JSON.parse(localStorage.getItem('profile'));                    // This might be messing up the "get playlist from other people"
        const playlistData = {
            "_id": data['_id'],
            "playlist_name": data['playlist_name'],
            "owner_name":profile.name,                                      // does this matter if it's someone else's playlist?
            "email": profile.email,                                         // same goes for this
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
                            <h3 className="russo-one-regular" style={{textAlign: 'center'}}> Import One of Your Own Playlists: </h3>
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