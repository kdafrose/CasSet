import {useState, useEffect} from 'react'
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const USER_ID = "m71y2aj3ermljpzjs9d8e6gxd";

export default function FindPlaylist() {
    const [userSearched, setUserSearched] = useState("");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;
    const [playlists, setPlaylists] = useState([]);

    const navigate = useNavigate();

    async function searchForPlaylists() {
        if(userSearched.trim() === ""){
            console.log("Enter a user's name");
            return;
        }

        var playlistParams = {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
        };
        
        var playlistCreate = await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists?limit=40', playlistParams)
            .then(response => response.json())
            .then(data => {
                setPlaylists(data.items);
                return data.items;
            })
            .then(playlists =>{
                return playlists;
            })
    }

    async function handlePlaylistChoice() {
        navigate('/displayplaylist');
    }

    // TO DO:
    // USER_ID is hardcoded: find a way to get that from the /v1/me API call
    //be able to display playlists in a more readable way: console.log is not a good way of doing that lol

    return(
        <div>
            <Container>
                <InputGroup className='mb-3' size='lg'>
                    <FormControl
                        placeholder="Enter User Name"
                        type="input"
                        onClick={event => {
                            if(event.key === "Enter"){
                                searchForPlaylists();
                            }
                        }}
                        onChange={event => {
                            setUserSearched(event.target.value);
                            console.log(userSearched);
                        }}
                    />
                    <Button onClick={searchForPlaylists}>
                        Find the playlists
                    </Button>
                </InputGroup>
            </Container>
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
                                localStorage.removeItem("playlistID");
                                localStorage.setItem("playlistID", playlist.id);
                                handlePlaylistChoice();
                            }}>
                            Select playlist
                        </Button>
                        </Card>
                        )
                    })}
                </Row>
            </Container>
        </div>
    )
}