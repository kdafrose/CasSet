import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState, useEffect} from 'react'

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b";

export default function SongSearch(){
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState(() => {
      const storedToken = localStorage.getItem("accessToken");
      console.log("Access Token: " + storedToken);
      return storedToken ? storedToken : null;
    });
    const [songs, setSongs] = useState([]);
    const [playlistID] = useState(() => {
      const storedPlaylistID = localStorage.getItem("playlistID");
      return storedPlaylistID ? storedPlaylistID : null;
    })
  
    // THIS IS GOING TO CHANGE WHEN WE DO PROPER IMPLEMENTATION
    const [profile, setProfile] = useState(() => {
      const storedProfile = localStorage.getItem("profile");
      return storedProfile ? JSON.parse(storedProfile) : null;
    });
  
    useEffect(() => {
      // API Access Token
      // Make Error Handling????
      var authorizeParam = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }
      fetch('https://accounts.spotify.com/api/token', authorizeParam)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  
    }, [])
  
    async function searchSong(){
  
      if(searchInput.trim() === ""){
        console.log("No input.");
        return;
      }
  
      var trackSearchParams = {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + accessToken
        }
      }

      await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&limit=20', trackSearchParams)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched songs");
        setSongs(data.tracks.items);
      })
      
    }

    async function handleSongAdd(songURI, playlistID) {

      var trackAddParams = {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ "uris": [songURI] })
      };

      await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', trackAddParams)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log("Song added?");
      })
    }  
  
    return (
      <div className="App">
        <Container>
          <InputGroup className="mb-3" size="lg">
            <FormControl
              placeholder="Search For a Song"
              type="input"
              onKeyPress={event => {
                if(event.key === "Enter"){
                  searchSong();
                }
              }}
              onChange={event => setSearchInput(event.target.value)}
            />
            <Button onClick={searchSong}>
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className="mx-2 row row-cols-4">
            {songs.map( (song, i) => {
              // console.log("-");
              return (
                <Card key={song.id}>
                <Card.Img src={song.album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{song.name}</Card.Title>
                  <Card.Subtitle>{song.artists[0].name}</Card.Subtitle>
                </Card.Body>
                <Button 
                  onClick={() => {handleSongAdd(song.uri, playlistID)}}>
                  Add to Playlist
                </Button>
              </Card>
              )
            })}
          </Row>
        </Container>
      </div>
    );
}