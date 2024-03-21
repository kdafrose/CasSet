import {useState, useEffect} from 'react'
import {Container, Button, Row, Card} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import '../css/FindPlaylist.css';


export default function FindPlaylist({onClose}) {
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });;
    const [playlists, setPlaylists] = useState([]);
    const [savedUserSpotifyID] = useState(() => {
        const storedSpotifyID = localStorage.getItem("userSpotifyID");
        return storedSpotifyID ? storedSpotifyID : null;
    })

    const navigate = useNavigate();

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
            console.log(data);
            return data.items;
        })
        .then(playlists =>{
            return playlists;
        })
    }

    useEffect(() => {

        searchForPlaylists();
    }, []);

    async function handlePlaylistChoice(data) {
        const profile = JSON.parse(localStorage.getItem('profile'));

        const playlistData = {
            "_id": data['_id'],
            "name": data['playlist_name'],
            "owner_name":profile.name,
            "date_created":new Date().toJSON().slice(0, 10),
            "sharing_link":data['sharing_link'],
            "note": "fill in later",
        }

        fetch('http://localhost:5000/playlist/postNewPlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlistData) // Use profileData instead of params
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        navigate('/displayplaylist');
    }

    const handleClose = () => {
        setAccessToken(""); // Reset access token when form is closed
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className='overlay-find'>
            <div className="form-container-find">
                <form className="find-playlist-form">
                    <button id="close-button" onClick={handleClose}>X</button>
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
                </form>
            </div>
        </div>
    )
}