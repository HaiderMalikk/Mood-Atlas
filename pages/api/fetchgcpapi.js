// /pages/api/fetchPlaces.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = {
        key: process.env.MY_SECRET_GOOGLE_MAPS_API_KEY,
        id: process.env.MY_SECRET_GOOGLE_MAPS_MAP_ID,
    };

    // Send the result back to the client
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places from API.' });
  }
}
