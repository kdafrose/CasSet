// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SongSearch from './components/SongSearch';
import Home from './components/Home';
import CreatePlaylist from './components/CreatePlaylist';
import FindPlaylist from './components/FindPlaylist';
import AddSong from './components/AddSong';
import DisplayPlaylist from './components/DisplayPlaylist';
import PlaySong from './components/PlaySong';
import MainSite from './components/MainSite';

function App() {
  //const [isLoading, setIsLoading] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/casset" element={<MainSite/>}/>
        <Route path="/createplaylist" element={<CreatePlaylist/>}/>
        <Route path="/song" element={<SongSearch/>}/>
        <Route path="/findplaylist" element={<FindPlaylist/>}/>
        <Route path="/addsong" element={<AddSong/>}/> 
        <Route path="/playsong" element={<PlaySong/>}/>
        <Route path="/displayplaylist" element={<DisplayPlaylist/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
