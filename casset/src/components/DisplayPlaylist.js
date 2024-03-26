import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import fetchGetMultiSongs from '../controller/fetchMultiSongs';

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
                "annotation": "fill in later",
            }
            songItems.push(songDoc);
        }

        console.log(songItems);
        fetchPostMultiSongs(songItems);
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