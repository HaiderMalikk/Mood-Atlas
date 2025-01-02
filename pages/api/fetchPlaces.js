// /pages/api/fetchPlaces.js

import axios from 'axios';

export default async function handler(req, res) {
  const {location, radius, key } = req.query; // Get parameters from the client-side request
  console.log("recived places fetch request from app, query: ", req.query);

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = {
      location: location,
      radius: radius, // Convert to meters
      key: key,
    };

    // Fetch data from Google Maps API
    const response = await axios.get(url, { params });

    // Send the result back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places from API.' });
  }
}
