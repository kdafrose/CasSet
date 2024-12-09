import {useState, useEffect} from 'react'
import {Container, Button, Row, Spinner, Card, Col} from 'react-bootstrap'
import '../css/FindPlaylist.css';
import {fetchPostPlaylist} from '../controller/playlistController';
import {fetchPostMultiSongs} from '../controller/songsController';

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
            const filteredItems = data.items.filter(item => item !== null && item !== undefined);
            setPlaylists(filteredItems);
            console.log(data);
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
            "shared_casset":false,
            "sharing_link":data['sharing_link'],
            "note": "fill in later",
        }

        fetchPostPlaylist(playlistData);
        tracksFetch(data['_id']);
    }

    var trackFetchParams = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + accessToken
        },
        limit: 50,
    }

    async function tracksFetch(playlistID){
        
        try {
            const response = await fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", trackFetchParams);
            const result = await response.json();
            console.log(result.items);
            addingSongsInDB(result.items);
        }
        catch(error) {
            console.error("Error: ", error);
        }
    }

    async function addingSongsInDB(data){
        let songItems = [];
        const playlistID = localStorage.getItem('playlistID');
        let dataLength =0;

        if( data.length > 0 & data.length <= 12){
            // playlist should have at least have 1-12 song
            dataLength = data.length;
        }
        else{
            dataLength = 12;
        }

        for( let i = 0; i < dataLength; i ++){
            let artists = []
            
            for (let j=0; j < data[i].track.artists.length; j++){
                artists.push(data[i].track.artists[j].name);
            }
            var songDoc = {
                "songID": data[i].track.id, //songID (Primary key)
                "playlistID": playlistID, // playlistID (Foreign key)
                "name": data[i].track.name,
                "artist":artists,
                "annotation": "Empty Note...",
                "song_image": data[i].track.album.images[0].url,
            }
            songItems.push(songDoc);
        }

        console.log(songItems);
        fetchPostMultiSongs(songItems);
    }

    const handleClose = () => {
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className='overlay-find'>
            <div className="form-container-find">
                <form id="find-playlist-form" className="scrollable">
                    <button className="close-button" onClick={handleClose}>X</button>
                    {playlists.length !== 0 ? (
                        <Container>
                            <Row className="mx-3 row row-cols-3">
                                {playlists.map( (playlist, i) => {
                                return (
                                    <Card id='card' className="scrollable" key={playlist?.name}>
                                        <Card.Img src={playlist?.images?.[0]?.url} id='card-img'/>
                                        <Card.Body id='card-body'>
                                            <Card.Title id='card-title'>{playlist?.name}</Card.Title>
                                            <Card.Subtitle id='card-subtitle'>{playlist?.description}</Card.Subtitle>
                                        </Card.Body>
                                        <Button  
                                            id='card-select-button'
                                            onClick={() => {
                                            // Change this to hold the selected playlistID with database connection
                                            localStorage.removeItem("playlistID");
                                            localStorage.setItem("playlistID", playlist?.id);

                                            const playlistInfo = {
                                                "_id": playlist?.id,
                                                "playlist_name": playlist?.name, 
                                                "sharing_link":playlist?.external_urls.spotify,
                                            }
                                        
                                            handlePlaylistChoice(playlistInfo);
                                        }}>
                                            select
                                        </Button>
                                    </Card>
                                )
                            })}
                        </Row>
                    </Container>

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