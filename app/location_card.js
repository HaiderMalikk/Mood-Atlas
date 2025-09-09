'use client';
import Image from 'next/image';
import logo from '../public/logo.png';
import linklogog from '../public/linkgrey.png';

export function LocationCard({ title, description, picture, reviews, matchscore, coordinates }) {
  let formattedreviews = '';
  if (reviews){
    formattedreviews = 'Reviews: ' + reviews + " ⭐️";
  }
  let formattedscore = '';
  if (matchscore){
    formattedscore = 'Match Score: ' + matchscore;
  }
  let message = "";
  if (title !== "Start by Filling the inputs and then click submit") {
    message = "I Would Recommend:";
  }
  
  // Function to open Google Maps with the given coordinates
  const openInGoogleMaps = () => {
    if (title && title !== "Start by Filling the inputs and then click submit") {
      // Use the place name and address for a more user-friendly search
      const searchQuery = encodeURIComponent(`${title} ${description}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
      window.open(mapsUrl, '_blank');
    }
  };
  
  return (
    <div>
      <div className="map-overlay-box">
        <div className="map-content">
          <div className="map-text">
            <div className="recommendation-header">
              <h4 className='map-title-starting'>{message}</h4>
              {message && title && title !== "Start by Filling the inputs and then click submit" && (
                <button 
                  className="google-maps-button" 
                  onClick={openInGoogleMaps}
                  title="Open in Google Maps"
                >
                  <Image 
                    src={linklogog} 
                    alt="Google Maps Link" 
                    width={20} // default width
                    height={20} // default height
                  />
                </button>
              )}
            </div>
            <h2 className="map-title">{title}</h2>
            <p className="map-description">{description}</p>
            <p className="map-description">{formattedreviews}</p>
            <p className="map-description">{formattedscore}</p>
          </div>
          {/*  Image component gets a valid src */}
          <Image 
            className="map-image" 
            src={picture ? picture : logo} 
            alt={title || 'Default Image'} 
            width={300} // default width
            height={200} // default height
          />
        </div>
      </div>
    </div>
  );
}
