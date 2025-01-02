'use client';
import React, { useState, useEffect } from "react";
import { Map } from "./map";
import { LocationCard } from "./location_card";
import { processInputs } from "./places_processing";
import { fetchUserCoordinates } from "./user_location"
import "./globals.css";

const WelcomePage = () => {
  const [mood, setMood] = useState("");
  const [activity, setActivity] = useState("");
  const [hobby, setHobby] = useState("");
  const [radius, setRadius] = useState(25);
  const [userCoordinates, setUserCoordinates] = useState(null);

  // Fetch user coordinates only once at the start hence why the mount is empty '[]'
  useEffect(() => {
    const getcoordinates = async () => {
    const coordinates = await fetchUserCoordinates();
    if (coordinates) {
      setUserCoordinates(coordinates);
    }
    else {
      alert("You Location could not be found, setting default to Toronto");
      setUserCoordinates({ lat: 43.6532, lng: -79.3832 });
    }
    console.log(`User coordinates set to: coordinates: lat: ${coordinates.lat}, lng: ${coordinates.lng}`);
    };
    getcoordinates();

  }, []);

  // State for user coordinates (user location)
  // State for displaying processed data, currently a placeholder
  const [processedData, setProcessedData] = useState({
    title: "Start by Filling the inputs and then click submit",
    address: "",
    picture: "",
    reviews: "",
    matchscore: null,
  });

  // State to manage loading icon, initially set to false as we only start on click
  const [loading, setLoading] = useState(false);

  // State to check if the process is done
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    // Check if any required fields are missing or if the radius is 0
    if (!mood || !activity || !hobby) {
      alert("Please fill in all the fields. If you want to skip a field, just type in N/A, but its recommended to fill them out.");
      return;
    }
  
    if (radius == 0) {
      alert("Radius cannot be 0.");
      return;
    }
  
    setLoading(true); // Set loading to true before making API call
    console.log("All inputs filled Sending Processing Request");
  
    // Process inputs
    const result = await processInputs(mood, hobby, activity, userCoordinates, radius);
    console.log("Processed Place data received at main page:", result);
  
    // Set the processed data to state
    setProcessedData({
      title: result.name || "No title available",
      address: result.address || "No address available",
      picture: result.photoReference || "", // If no photoReference, leave empty to prevent errors as we have a default if empty
      reviews: result.reviews || "No reviews available",
      matchscore: result.matchpercentage || 0
    });
  
    if (result.coordinates) {
      const { lat, lng } = result.coordinates;
      setUserCoordinates({ lat, lng });
      console.log(`User coordinates set to: lat: ${lat}, lng: ${lng}`);
    } else {
      console.log("No coordinates found in result");
    }

  
    setLoading(false); // Set loading to false after processing data is complete
    setDone(true); // Set done to true when the process is complete
    console.log("Done with processing Displaying results");
  };
  

  const handleReset = () => {
    // Reset all states
    setMood("");
    setActivity("");
    setHobby("");
    setRadius(25);
    setUserCoordinates(userCoordinates);
    setProcessedData({
      title: "Start by Filling the inputs and then click submit",
      address: "",
      picture: "",
      reviews: "",
      matchscore: null,
    });
    setDone(false); // Reset done state
  };

  return (
    <div className="container">
      {/* Left Side */}
      <div className="left">
        <div className="header-title">
          <header className="header-title">
            <h1>Welcome to Mood Atlas</h1>
          </header>
        </div>
        <div className="input-group">
          <div className="input-container">
            <label htmlFor="mood-input" className="input-title">
              How do you feel?
            </label>
            <input
              type="text"
              id="mood-input"
              className="input-box"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Happy, sad, excited, etc."
            />
          </div>
          <div className="input-container">
            <label htmlFor="activity-input" className="input-title">
              What do you want to do?
            </label>
            <input
              type="text"
              id="activity-input"
              className="input-box"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Go for a walk, try a new restaurant, etc."
            />
          </div>
          <div className="input-container">
            <label htmlFor="hobby-input" className="input-title">
              What do you like to do?
            </label>
            <input
              type="text"
              id="hobby-input"
              className="input-box"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              placeholder="Play music, paint, etc."
            />
          </div>
          <div className="slider-container">
            <label htmlFor="radius-slider" className="slider-title">
              Radius
            </label>
            <input
              type="range"
              id="radius-slider"
              className="slider"
              min="0"
              max="100"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
            <span className="radius-value">{radius} km</span>
          </div>
        </div>
        <div className="button-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div> {/* Spinner */}
              <span style={{ marginLeft: "10px" }}>Loading...</span> {/* Text next to the spinner */}
            </div>
          ) : (
            <>
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
              {done && (
                <button className="submit-button" style={{ marginLeft: "30px" }} onClick={handleReset}>
                  Reset
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {/* Right Side */}
      <div className="right">
      {!userCoordinates ? (
        <div className="map-container">
           <div className="loading-container-map">
              <div className="loading-spinner"></div> {/* Spinner */}
              <span style={{ marginLeft: "10px" }}>Loading Map...</span> {/* Text next to the spinner */}
            </div>
        </div>
        ) : (
          {/* only loading the map when the user coordinates are available */},
          <Map userCoordinates={userCoordinates} /> 
        )}
        <LocationCard
          title={processedData.title}
          description={processedData.address}
          picture={processedData.picture || ""}
          reviews={processedData.reviews}
          matchscore={processedData.matchscore}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
