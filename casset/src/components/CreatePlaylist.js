import {useState, useEffect} from 'react'
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap'

const USER_ID = "m71y2aj3ermljpzjs9d8e6gxd";
const CLIENT_ID = "836985c6fb334af49ed4a3fb55e973fe";
const CLIENT_SECRET = "d62652ceebc54d32a9292f154adc3e7b";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

export default function CreatePlaylist() {
    const [playlistName, setPlaylistName] = useState("");
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

    async function redirectToAuthCodeFlow(CLIENT_ID) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);
    
        localStorage.setItem("verifier", verifier);
    
        const params = new URLSearchParams();
        params.append("client_id", CLIENT_ID);
        params.append("response_type", code);
        params.append("redirect_uri", "http://localhost:3000/");
        params.append("scope", "user-read-private user-read-email playlist-modify-public");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
    
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    function generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    async function generateCodeChallenge(codeVerifier) {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

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
            body: {
                'name': playlistName,
                'description': 'made with CasSet',
                'public' : true
            }
        }

        var playlistCreate = await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', playlistParams)
            .then(response => response.json())
            .then(data => {
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
                        onKeyPress={event => {
                            if(event.key === "Enter"){
                            makePlaylist();
                            }
                        }}
                        onChange={event => setPlaylistName(event.target.value)}
                    />
                    <Button onClick={makePlaylist}>
                        Make!
                    </Button>
                </InputGroup>
            </Container>
        </div>
    )
}