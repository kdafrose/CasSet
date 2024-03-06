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
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
  
    // THIS IS GOING TO CHANGE WHEN WE DO PROPER IMPLEMENTATION
    const [profile, setProfile] = useState(() => {
      const storedProfile = localStorage.getItem("profile");
      console.log("Does a profile exist?  " + storedProfile);
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
  
    async function search(){
      console.log("Search for " + searchInput);
  
      // Get request using search to get the Artist ID
      var artistSearchParams = {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + accessToken
        }
      }
      var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistSearchParams)
      .then(response => response.json())
      .then(data => {return data.artists.items[0].id})
  
      console.log("Artist ID is " + artistID);
  
      // like above but using the Artist ID to grab the albums from that artist
  
      var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=25', artistSearchParams)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setAlbums(data.items);
        });
      // Display albums
    }
  
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
      var trackResult = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&limit=20', trackSearchParams)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched songs");
        setSongs(data.tracks.items);
      })
      
    }

    // The below only works if we log in with Spotify I think which is something else
    async function userUpdate(){
      // var userIDRetrieval = {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type' : 'application/json',
      //     'Authorization' : 'Bearer ' + accessToken
      //   },
      // }
      // fetch('https://api.spotify.com/v1/me', userIDRetrieval)
      //   .then(response => response.json())
      //   .then(data =>{
      //     console.log(data)
      //     console.log(accessToken)  
      //   })
    }
  
    async function spotifyLogin(){
      console.log("There's a Spotify Web API tutorial on this... look at that")
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
            <Button onClick={spotifyLogin}>
              Spotify Login (temp)
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className="mx-2 row row-cols-4">
            {songs.map( (song, i) => {
              // console.log("-");
              return (
                <Card>
                <Card.Img src={song.album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{song.name}</Card.Title>
                  <Card.Subtitle>{song.artists[0].name}</Card.Subtitle>
                </Card.Body>
                <Button onClick={() => console.log("Song clicked :)")}>
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