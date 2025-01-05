import axios from 'axios';

export default async function handler(req, res) {
  const ipurl = "https://api.ipify.org?format=json"; 
  const ipresponse = await axios.get(ipurl);
  const ip = ipresponse.data.ip;
  const apikey = process.env.MY_SECRET_IPAPI_API_KEY;
  //const url = `http://api.ipapi.com/api/${ip}?access_key=${apikey}`;  until error fixed

  try {
    console.log("Requesting:", url);

    const response = await axios.get(url);
    console.log("Full response:", response.data);

    if (!response.data || !response.data.latitude || !response.data.longitude) {
      console.error("Invalid API response:", response.data);
      return res.status(500).json({
        error: "Invalid response from API",
        data: response.data,

      });
    }

    res.status(200).json({ lat: response.data.latitude, lng: response.data.longitude });
  } catch (error) {
    console.error("API Request Failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch user coordinates." });
  }
}
