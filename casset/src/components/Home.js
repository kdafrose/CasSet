import React, { useState } from 'react';
import Googlelogin from './Googlelogin';
import '../css/Home.css';
import imageSrc from '../media/Header.png'; // header image
import rectangleImageSrc from '../media/Rolling.gif'; // home box image
import logoSrc from '../media/casset.png';
import { useEffect } from 'react';

export default function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userSpotifyID")
    localStorage.removeItem("tokenType");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("profileExists");
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div>
      <img src={imageSrc} alt="CASSET" className="header" />
      <div className="container">
        <div className="rectangle-container">
          <img
            src={rectangleImageSrc}
            alt="Rectangle Image"
            className="rectangle-image"
            onLoad={handleImageLoad}
          />
          {imageLoaded && <Googlelogin />}
        </div>
      </div>
      <footer>
        <a href="http://localhost:3000">
          <img src={logoSrc} alt="logo" style={{maxWidth: "50px"}}/>
        </a>
        &emsp;© 2024 CasSet&emsp;About&emsp;Privacy Policy&emsp;Contact
      </footer> 
    </div>
  );
}