'use client';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
/* 
api comunication with js-api-loader so no api request is made here
*/


export function Map({userCoordinates}) {
  const mapRef = useRef(null); // use ref so that the map can render itself
  const mapicon = "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"

  useEffect(() => {
    const getMap = async () => {
      console.log('getting map');

      console.log("Getting API key from GCP API");
      const response = await axios.get('/api/fetchgcpapi', {headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      console.log("Response From GCP API REQUEST: ",response);
      const mapidkey = response.data.id;
      const mapapikey = response.data.key;

      // Check if the API key and map ID are present
      if (!mapapikey || !mapidkey) {
        console.error('Google Maps API Key or Map ID is missing');
        return;
      }

      // Loader (specifies map details and key)
      const loader = new Loader({
        apiKey: mapapikey,
        version: 'weekly', // Map updates weekly
      });

      // Dynamically load the Google Maps library
      const { Map } = await loader.importLibrary('maps');
      const position = userCoordinates; // Position of the map (center) in the form of {lat, lng}

      // Google map options
      const googleMapsOptions = {
        center: position,
        zoom: 14,
        mapId: mapidkey,
      };

      // Ensure the map container is correctly sized and visible
      if (mapRef.current) {
        const map = new Map(mapRef.current, googleMapsOptions); // make new map
        console.log('map created');
        const { Marker } = await loader.importLibrary('marker'); // create a marker for the map
        // specify the properties of the marker
        new Marker({
          map: map,
          position: position,
          icon: mapicon,
        });
        console.log('Marker created');
      } else {
        console.error('Map container not found!');
      }
    };

    getMap(); // Get the map after calling the function
  }, [userCoordinates]); // Only run this when user Coordinates changes

  return (
    // this file returns the rendered map wrapped in a div
      <div className="map-container" ref={mapRef}/>
  );
}
