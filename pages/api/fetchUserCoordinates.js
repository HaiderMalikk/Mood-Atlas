import axios from 'axios';

export default async function handler(req, res) {
  //const url = "https://ipapi.co/json/";
  const url = "http://api.ipapi.com/api/76.66.141.159?access_key=38737091724f957570b74a376584ad21";

  try {
    console.log("Requesting:", url);

    const response = await axios.get(url);
    console.log("Full response:", response.data);

    if (!response.data || !response.data.latitude || !response.data.longitude) {
      console.error("Invalid API response:", response.data);
      return res.status(500).json({
        error: "Invalid response from ipapi API",
        data: response.data,

      });
    }

    res.status(200).json({ lat: response.data.latitude, lng: response.data.longitude });
  } catch (error) {
    console.error("API Request Failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch user coordinates." });
  }
}
