//import { useState } from "react";
import './App.css';
import Googlelogin from './Googlelogin';

function App() {
  //const [isLoading, setIsLoading] = useState(true);

  return (
  <div style={{height:"90vh"}}>

    <div id = "Nav-bar" style ={{height:"10vh"}}>
      <h1 style={{}}>CasSet</h1>
    </div>

    <Googlelogin/>
  </div>
  )
}

export default App;
