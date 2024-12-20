'use client';

import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
// node procces to use env file


export function Map() {
    const mapRef = React.useRef(null); // use ref so that the map can render itself

    // init the map using use effect
    useEffect(() => {
         // some library functions are async, so we need to use async here for the get map function
        const getmap = async () => {
            console.log('getting map');
            // loader (specifies map details and key)
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                version: 'weekly', // map updates weekly
            })
            const {Map} = await loader.importLibrary('maps'); // load the map library
            const position = { lat: 43.642693, lng: -79.3871189 }; // position of the map (center)
            const googlemapsoptions = { center: position, zoom: 12, mapTypeId: 'roadmap' }; // map options

            // setup map
            const map = new Map(mapRef.current, googlemapsoptions);
        }
        getmap(); // get map after calling the function

    }, []); // only run this once
    
    return (
        <div>
            <h1>Map</h1>
            <div style={{ height: '400px', width: '400px'}} ref={mapRef}/>
        </div>
    );
}