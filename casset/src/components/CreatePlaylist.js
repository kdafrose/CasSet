import {useState} from 'react'
import {Container, InputGroup, FormControl, Button, Card, Row} from 'react-bootstrap'
import AddSong from './AddSong';
import fetchPostMultiSongs from './fetchPostMultiSongs';
import fetchPostPlaylist from './fetchPostPlaylist';

// const params = new URLSearchParams(window.location.search);
// const code = params.get("code");

export default function CreatePlaylist({ onClose }) {
    const [playlistName, setPlaylistName] = useState("Playlist Name");
    const [playlistDescription, setPLaylistDescription] = useState("Made with CasSet");
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        return storedToken ? storedToken : null;
    });;
    const [savedUserSpotifyID] = useState(() => {
        const storedSpotifyID = localStorage.getItem("userSpotifyID");
        return storedSpotifyID ? storedSpotifyID : null;
    })
    const [playlistMade, setPlaylistMade] = useState(false);
    const [playlistID, setPlaylistID] = useState("");
    const [songsToAdd, setSongsToAdd] = useState([]);

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
        
        await fetch('https://api.spotify.com/v1/users/' + savedUserSpotifyID + '/playlists', playlistParams)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const profileInfo = JSON.parse(localStorage.getItem("profile"))
                const playlistData = {
                    "_id": data.id, // id of playlist (primary key)
                    "playlist_name": data.name, // playlist name
                    "owner_name":profileInfo.name, // name of user
                    "email": profileInfo.email,
                    "sharing_link": data.external_urls.spotify,
                    "note": "fill in later", 
                }
                console.log(playlistData)
                fetchPostPlaylist(playlistData);
                setPlaylistID(data.id);
                setPlaylistMade(true);
            })

        
    }

    function updateSongList(song) {
        setSongsToAdd(prevSongs => [...prevSongs, song])
        //console.log(songsToAdd);
    }

    function removeSong(goodbyeSong) {
        setSongsToAdd(prevList => prevList.filter(song => song.id !== goodbyeSong.id));
    }

    async function handleSongAdd() {

        let songsItems = [], songsDocuments = []
        const songURI = songsToAdd.map(item => (item.uri));
        songsToAdd.map(item => songsItems.push(item));   

        // parsing into proper docuemnts
        for(let i =0; i < songsItems.length; i++){
            // case if there is multiple artists
            let artists = []
            console.log(songsItems[i].artists);
            for (let j=0; j < songsItems[i].artists.length; j++){
                artists.push(songsItems[i].artists[j].name);
            }

            var songDoc = {
                "songId": songsItems[i].id,
                "playlistID":playlistID,
                "name":songsItems[i].name,
                "artist":artists,
                "annotation":"fill in later",
            }

            songsDocuments.push(songDoc);
        }
        fetchPostMultiSongs(songsDocuments);
        
        var trackAddParams = {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + accessToken,
          },
          body: JSON.stringify({'uris' : songURI}),
        };
  
        await fetch('https://api.spotify.com/v1/playlists/' + playlistID + '/tracks', trackAddParams)
            .then(response => response.json())

        handleClose();
    }

    const handleClose = () => {
        setPlaylistName("");
        setAccessToken(""); // Reset access token when form is closed
        onClose(); // Notify parent component to close the form
    };

    return(
        <div className="overlay">
            <div className="form-container">
                {playlistMade === false ? (
                    <form className="create-playlist-form">
                        <button className="close-button" onClick={handleClose}>X</button>
                        <Container id="create-container">
                            <InputGroup className='mb-3' size='lg'>
                                <FormControl
                                    placeholder="Playlist Name"
                                    type="input"
                                    onKeyDown={event => {
                                        if(event.key === "Enter"){
                                        makePlaylist();
                                        }
                                    }}
                                    onChange={event => {
                                        setPlaylistName(event.target.value);
                                    }}
                                />
                                <Button onClick={makePlaylist}>
                                    Make
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
                    </form>
                ) : (
                    <>
                        <form className="new-playlist-songs">
                            <div id="new-playlist-div">
                                <button className="close-button" onClick={handleClose}>X</button>
                                <h1 id="newly-playlist-title">{playlistName}</h1>
                                <Button id="make-playlist" 
                                onClick={handleSongAdd}>
                                    Make Playlist
                                </Button>
                            </div>
                            <AddSong onSongUpdate={updateSongList}/>
                            <div id="songs-added">
                                <Row className="mx-2 row row-cols-1">
                                {songsToAdd.map((song) => {
                                    //console.log(song)
                                    return (
                                        <>
                                            <h4 className='song-name-add'>
                                                {song.name}
                                            </h4>
                                        <div className='song-list-display'>
                                            <Button className="remove-song-select"onClick={() => {removeSong(song)}}>X</Button> 
                                            <Card key={song.id} className="song-add-image">
                                                <Card.Img src={song.album.images[0].url}/>
                                            </Card>
                                        </div>
                                    </>
                                    )
                                })}
                                </Row>
                            </div>
                        </form>
                    </>
                )
                }
            </div>
        </div>
    )
}