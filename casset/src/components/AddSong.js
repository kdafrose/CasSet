import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState} from 'react'

// https://oauth.pstmn.io/v1/browser-callback for testing :)

export default function AddSong(props){
    const [searchInput, setSearchInput] = useState("");
    const [accessToken] = useState(() => {
      const storedToken = localStorage.getItem("accessToken");
      return storedToken ? storedToken : null;
    });
    const [songs, setSongs] = useState([]);
    // const [playlistID] = useState(() => {
    //   const storedPlaylistID = localStorage.getItem("playlistID");
    //   return storedPlaylistID ? storedPlaylistID : null;
    // })
  
    // THIS IS GOING TO CHANGE WHEN WE DO PROPER IMPLEMENTATION
    const {onSongUpdate} = props;
  
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
        setSongs(data.tracks.items);
      })
      
    }

    async function handleSongAdd(songURI, songName, songArtist, playlistID) {

      var trackAddParams = {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + accessToken,
        },
        body: JSON.stringify({'uris' : [songURI]}),
      };

      await fetch('https://api.spotify.com/v1/playlists/' + playlistID.toString() + '/tracks', trackAddParams)
      .then(response => response.json())
    }  
  
    return (
      <div className="App">
        <Container id="add-song-search">
          <InputGroup className="mb-3" size="lg">
            <FormControl
              placeholder="Search for songs"
              type="input"
              onChange={event => setSearchInput(event.target.value)}
              id="search-form"
            />
            <Button onClick={searchSong} id="search-button">
              Search
            </Button>
          </InputGroup>
        </Container>
        <Container>
          <Row className="mx-2 row row-cols-4">
            {songs.map( (song, i) => {
              //console.log(song)
              return (
                <Card id='song-card' className='scrollable' key={song.id}>
                <Card.Img id='song-card-img' src={song.album.images[0].url}/>
                <Card.Body>
                  <Card.Title id='song-card-title'>{song.name}</Card.Title>
                  <Card.Subtitle id='song-card-subtitle'>{song.artists[0].name}</Card.Subtitle>
                </Card.Body>
                <Button 
                  id='song-card-add-button'
                  onClick={() => onSongUpdate(song)}>
                  add
                </Button>
              </Card>
              )
            })}
          </Row>
        </Container>
      </div>
    );
}