//import { useState } from "react";
import './App.css';
import Googlelogin from './Googlelogin';
import SpotifyConnect from './SpotifyConnect';

function App() {
  //const [isLoading, setIsLoading] = useState(true);

  return (
  <div style={{height:"90vh"}}>

    <div id = "Nav-bar" style ={{height:"10vh"}}>
      <h2 style={{}}>CasSet</h2>
    </div>

    <Googlelogin/>

    <SpotifyConnect/>
  </div>
  )
}

export default App;
