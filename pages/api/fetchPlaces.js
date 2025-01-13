import axios from 'axios';

export default async function handler(req, res) {
  const { lat, lng, radius } = req.query; // Get parameters

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Missing required parameters (lat, lng, radius).' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:searchNearby';

    const response = await axios.post(
      url,
      {
        maxResultCount: 20, // Limit results
        locationRestriction: {
          circle: {
            center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
            radius: parseInt(radius), // Convert radius to integer
          },
        },
      },
      {
        // Fix opening hours
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.MY_SECRET_GOOGLE_MAPS_API_KEY, // Use secure env variable
          'X-Goog-FieldMask': `
            places.displayName,
            places.location,
            places.formattedAddress,
            places.types,
            places.rating,
            places.photos,
          `.replace(/\s+/g, ''), // Remove extra spaces
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching places:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch places from API.' });
  }
}
