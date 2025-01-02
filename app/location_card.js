'use client';
import Image from 'next/image';
import logo from '../assets/logo.png';

export function LocationCard({ title, description, picture, reviews, matchscore }) {
  let formattedreviews = '';
  if (reviews){
    formattedreviews = 'Reviews: ' + reviews + " ⭐️";
  }
  let formattedscore = '';
  if (matchscore){
    formattedscore = 'Match Score: ' + matchscore;
  }
  return (
    <div>
      <div className="map-overlay-box">
        <div className="map-content">
          <div className="map-text">
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
