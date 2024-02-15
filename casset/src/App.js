import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState, useEffect} from 'react'

const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

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

  // Search time :)

  async function search(){
    console.log("Search for " + searchInput);

    // Get request using search to get the Artist ID
    var artistParams = {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParams)
    .then(response => response.json())
    .then(data => console.log(data))
    // like above but using the Artist ID to grab the albums from that artist

    // Display albums
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search For Artist"
            type="input"
            onKeyPress={event => {
              if(event.key === "Enter"){
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          <Card>
            <Card.Img src="#"/>
            <Card.Body>
              <Card.Title>Album Name Here</Card.Title>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
    );
  }

export default App;
