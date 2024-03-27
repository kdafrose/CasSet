// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SongSearch from './components/SongSearch';
import Home from './components/Home';
import CreatePlaylist from './components/CreatePlaylist';
import FindPlaylist from './components/FindPlaylist';
import AddSong from './components/AddSong';
import PlaySong from './components/PlaySong';
import MainSite from './components/MainSite';
import EditCasset from './components/EditCasset';
import Note from './components/Note';
import PlayCasset from './components/PlayCasset';

function App() {
  //const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/casset" element={<MainSite/>}/>
        
        <Route path="/createplaylist" element={<CreatePlaylist/>}/>
        <Route path="/findplaylist" element={<FindPlaylist/>}/>

        <Route path="/song" element={<SongSearch/>}/>
        <Route path="/addsong" element={<AddSong/>}/> 
        <Route path="/playsong" element={<PlaySong/>}/>
        <Route path="/editcasset" element={<EditCasset/>}/>
        <Route path="/note" element={<Note/>}/>
        <Route path="/playcasset" element={<PlayCasset/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;