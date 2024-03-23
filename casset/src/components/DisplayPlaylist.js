import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState, useEffect} from 'react'

export default function DisplayPlaylist() {
    const [playlistID, setPlaylistID] = useState(() => {
        const storedPlaylistID = localStorage.getItem("playlistID");
        return storedPlaylistID ? storedPlaylistID : null;
    })
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });
    const [playlistTracks, setPlaylistTracks] = useState([]);

    var trackFetchParams = {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + accessToken
        },
        limit: 50,
    }

    useEffect( () => {
        const tracksFetch = async () => {
            try {
                const response = await fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", trackFetchParams);
                const result = await response.json();
                setPlaylistTracks(result.items); // song items
                // console.log(result)
                console.log(result.items);
                addingSongsInDB(result.items);
            }
            catch(error) {
                console.error("Error: ", error);
            }
        };

        tracksFetch();
    }, []);

    async function addingSongsInDB(data){
        let songItems = [];
        const playlistID = localStorage.getItem('playlistID');

        for( let i = 0; i < 12; i ++){
            var songDoc = {
                "_id": data[i].track.id, //songID (Primary key)
                "playlistID": playlistID, // playlistID (Foreign key)
                "name": data[i].track.name,
                "artist": data[i].track.artists[0].name,
                "annotation": "fill in later",
            }
            songItems.push(songDoc);
        }

        console.log(songItems);

        fetch('http://localhost:5000/songs/postMultipleSongs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(songItems) // Use profileData instead of params
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const trackLengthToMinutes = (milliValue) => {
        const seconds = Math.floor(milliValue / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainSeconds = seconds % 60;

        return(minutes + "m " + remainSeconds + "s");
    }

    return ( 
        <div>
            { playlistTracks.length !== 0 ? (
                <Container>
                    <Row className="mx-2 row row-cols-2">
                        {playlistTracks.map( (singleTrack, i) => {
                            var trackObj = singleTrack.track;
                            return (
                                <Card className='d-flex flex-row' key={trackObj.name}>
                                    <Card.Img src={trackObj.album.images?.[0]?.url} style={{ height: '100px', width: '100px', objectFit:'cover'}}/>
                                    <Card.Body className='flex-grow-1' style={{width:'300px'}}>
                                        <Card.Title>{trackObj.name}</Card.Title>
                                        <Card.Subtitle>by: {trackObj.artists[0].name}</Card.Subtitle>
                                        <Card.Text>{trackLengthToMinutes(trackObj.duration_ms)}</Card.Text>
                                    </Card.Body>
                                    <Button 
                                        style={{height:'100px', width: '100px', objectFit:'cover'}} 
                                        // onClick={()}
                                        >
                                        Play
                                    </Button>
                                </Card>
                                )
                        })}
                    </Row>
                </Container>
                ) : (
                    <p>
                        No songs in this playlist
                    </p>
                )
            }
        </div>
    )
}