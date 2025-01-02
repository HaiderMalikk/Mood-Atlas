'use client';

import React, { useState } from 'react';
import './globals.css';
import Image from 'next/image';
import logo from '../assets/logo-nobg.png';

const Layout = ({ children }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Toggle About Card Pop-up
  const toggleAboutPopup = () => {
    setIsAboutOpen(!isAboutOpen);
  };

  return (
    <html>
      <head>
        <script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=YOUR_CALLBACK_NAME`}
        ></script>
      </head>
      <body>
        <header className='header-links'>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            {/* About on the left */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <h1 
                className="about-header button" 
                style={{ margin: 0, cursor: 'pointer' }}
                onClick={toggleAboutPopup}
              >
                <img src="https://img.icons8.com/?size=100&id=82450&format=png&color=000000" alt="About" style={{ width: '20px', height: '20px', marginTop: '-10px', marginBottom: '-5px', marginRight: '5px'}} />
                About
              </h1>
            </div>
            {/* Github on the right */}
            <div style={{ display: 'flex', gap: '20px',}}>
              <a href="https://github.com/HaiderMalikk/Mood-Atlas" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none',}}>
                <h1 className="github-header button" style={{ margin: 0, cursor: 'pointer',}}>
                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="Github" style={{ width: '20px', height: '20px', marginTop: '-10px', marginBottom: '-5px', marginRight: '5px'}} />
                  Github</h1>
              </a>
            </div>
          </nav>
        </header>

        {/* Solid black line divider */}
        <div style={{ borderBottom: '5px solid black', marginBottom: '20px' }}></div>

        {/* About Card Overlay */}
        {isAboutOpen && (
          <div className='about-overlay'>
            <div className="about-card">
                <Image 
                  className="map-image" 
                  src={logo} 
                  alt={'logo'} 
                  style={{ width: '120px', height: '120px', marginTop: '-20px', marginBottom: '-20px'}}
                  />
                <h2>'Chart your feelings, discover your destination'</h2>
                <h3>What is Mood Atlas?</h3>
                <p>is an innovative app that recommends destinations based on user moods, places, or feelings. The project integrates multiple technologies for seamless functionality. The combination of AI and real-time data creates a personalized experience, guiding users to destinations that match their feelings. </p>
                <h3>How does it work?</h3>
                <p>To Learn How it Works, Click on the 'Github' icon on the top right. This will give you a in-depth look at the code and how it was built and how it works.</p>
                <h3>About the Developer</h3>
                <p>Developed by <a href="https://haidermalikk.github.io/HaiderMaliksWebsite/" target="_blank" rel="noopener noreferrer">Haider Malik</a>, a software engineer with a passion for creating innovative AI applications.</p>
                <button
                  onClick={toggleAboutPopup}
                  className="close-button"
                  >
                  Close
                </button>
            </div>
          </div>
        )}

        <main>
          {children}
        </main>
        <footer>
          {/* Add your footer content here */}
        </footer>
      </body>
    </html>
  );
};

export default Layout;
