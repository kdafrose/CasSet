import {useState, useEffect} from 'react'
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap'

// USER_ID is hard_coded I'd have to do this myself 
const USER_ID = "m71y2aj3ermljpzjs9d8e6gxd";
// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

export default function CreatePlaylist() {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPLaylistDescription] = useState("Made with CasSet");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;

    async function makePlaylist() {
        if(playlistName.trim() === ""){
            console.log("Please input a name for your playlist.");
            return;
        }

        var playlistParams = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + accessToken
            },
            body: JSON.stringify({ 
                "name": playlistName,
                "description": playlistDescription,
                "public" : true,
            })
        };
        
        var playlistCreate = await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', playlistParams)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log("The owner of this playlist is: " + data.owner.display_name);
                console.log("The description of said playlist is: " + data.description);
                console.log("The ID for the playlist is: " + data.id);
                console.log("The href (super useful) is: " + data.href);

            })
    }


    return(
        <div>
            <Container>
                <InputGroup className='mb-3' size='lg'>
                    <FormControl
                        placeholder="Playlist Name"
                        type="input"
                        onClick={event => {
                            if(event.key === "Enter"){
                            makePlaylist();
                            }
                        }}
                        onChange={event => {
                            setPlaylistName(event.target.value);
                            console.log(playlistName);
                        }}
                    />
                    <Button onClick={makePlaylist}>
                        Make!
                    </Button>
                </InputGroup>
                <FormControl 
                    placeholder="Enter description here" 
                    type="input"
                    onChange={event =>{
                        setPLaylistDescription(event.target.value);
                    }}
                    >

                </FormControl>
            </Container>
        </div>
    )
}