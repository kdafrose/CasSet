import React from 'react';
import Googlelogin from './Googlelogin';
import './Home.css';
import imageSrc from './Header.png'; // header image
import rectangleImageSrc from './HomeBox.png'; // home box image

export default function Home() {
  return (
    <div>
      <img src={imageSrc} alt="CASSET" className="header" />
      <div className="container">
        <div className="rectangle-container">
          <img src={rectangleImageSrc} alt="Rectangle Image" className="rectangle-image" />
          <Googlelogin />
        </div>
      </div>
      <footer>
        LOGO_HERE © 2024 CasSet 
      </footer> 
    </div>
  );
}