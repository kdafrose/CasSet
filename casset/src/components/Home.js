import React from 'react';
import Googlelogin from './Googlelogin';
import './Home.css'; // Import CSS file
import imageSrc from './Header.png'; // Import the image

export default function Home() {
  return (
    <div>
      <img src={imageSrc} alt="CASSET" className="header" />
      <div className="page-container"> {/* Use 'page-container' class */}
        <Googlelogin />
      </div>
    </div>
  );
}