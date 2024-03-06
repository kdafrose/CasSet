import {useState, useEffect} from 'react'
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap'

const USER_ID = "m71y2aj3ermljpzjs9d8e6gxd";

export default function FindPlaylist() {
    const [userSearched, setUserSearched] = useState("");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;

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
        
        var playlistCreate = await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', playlistParams)
            .then(response => response.json())
            .then(data => {
                console.log("The name of the playlist is: " + data.items[3].name);
            })
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
        </div>
    )
}