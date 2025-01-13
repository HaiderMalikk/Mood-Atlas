'use client';
import { fetchPlaces } from "./places_fetch";
import { fetchLLMresponse } from "./llm_call";
import axios from "axios";

export async function processInputs(mood, hobby, activity, userCoordinates, radius, gonow) {
  console.log(`Starting place processing for mood: ${mood}, hobby: ${hobby}, activity: ${activity}, coordinates: Lat: ${userCoordinates.lat}, Lng: ${userCoordinates.lng}, radius: ${radius}`);
  try {
    // Fetch places using the helper function
    const places = await fetchPlaces(userCoordinates, radius, gonow);
    console.log("Places received at places processing");

    // Check if places were retrieved
    if (places && places.length > 0) {
      console.log("Starting place processing");

      // Fetch data from the Open AI API using the helper function
      console.log("Sending places to Open AI for response");
      const LLMResult = await fetchLLMresponse(places, mood, hobby, activity);

      if (LLMResult !== null) {
        console.log("Extracting place number from LLM response");
      } else {
        console.warn("No valid response from LLM.");
      }

      const finalPlaceNumber = LLMResult["place number from llm"];
      console.log(`Final place number: ${finalPlaceNumber}`);
      const matchpercentage = LLMResult["matchscore"];

      console.log("Getting place details");

      // getting api key to be used for google maps picture
      console.log("Getting API key from GCP API");
      const response = await axios.get('/api/fetchgcpapi', {headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      console.log("Response From GCP API REQUEST: ",response);
      const apikey = response.data.key;

      // Extract details for place
      const finalPlace = places[finalPlaceNumber];  // Directly access the place from the array NO NEED FOR places.results as we deal with that in places fetch
      const title = finalPlace.displayName.text;
      function formatAddress(address) {
        // Split the address by commas
        const parts = address.split(',');
      
        // Return the first two parts of the address
        if (parts.length > 1) {
          return parts.slice(0, 2).join(',').trim();
        }
      
        // If there's no comma, return the full address
        return address;
      }
      const Fulladdress = finalPlace.formattedAddress;
      const address = formatAddress(Fulladdress); // taking off the postal and country 
      const photoReference = finalPlace.photos && finalPlace.photos[0]?.name 
                              ? `https://places.googleapis.com/v1/${finalPlace.photos[0].name}/media?key=${apikey}&maxWidthPx=400`
                              : "No photo available will be set to default in page.js.";
      const coordinates = finalPlace.location;
      const reviews = finalPlace.rating;

      console.log(`Final Processed Place: Name - ${title}, Address - ${address}, Photo URL - ${photoReference}, coordinates - lat: ${coordinates.lat}, lng: ${coordinates.lng}, reviews - ${reviews} matchpercentage - ${matchpercentage}%`);
      console.log("Sending final place to page for rendering");
      return { name: title, address: address, photoReference: photoReference, coordinates: coordinates, reviews: reviews, matchpercentage: matchpercentage};

    } else {
      console.warn("No places found for the given coordinates.", places);
      return {
        name: `No places found for your mood: "${mood}".`,
        address: `No places found for your hobby: "${hobby}".`,
        reviews: `No places found for your activity: "${activity}".`
      };
    }
  } catch (error) {
    console.error("Error processing inputs in processInputs:", error);
    return {
      name: `Error retrieving places for your mood: "${mood}".`,
      address: `Error retrieving places for your hobby: "${hobby}".`,
      reviews: `Error retrieving places for your activity: "${activity}".`
    };
  }
}
