'use client';
import { fetchPlaces } from "./places_fetch";
import { fetchFlaskData } from "./llm_call";

export async function processInputs(mood, hobby, activity, userCoordinates, radius) {
  console.log(`Starting place processing for mood: ${mood}, hobby: ${hobby}, activity: ${activity}, coordinates: Lat: ${userCoordinates.lat}, Lng: ${userCoordinates.lng}, radius: ${radius}`);
  try {
    // Fetch places using the helper function
    const places = await fetchPlaces(userCoordinates, radius);
    console.log("Places received at places processing");

    // Check if places were retrieved
    if (places && places.length > 0) {
      console.log("Starting place processing");

      // Fetch data from the Flask API using the helper function
      console.log("Sending places to Flask call file for response");
      const flaskResult = await fetchFlaskData(places, mood, hobby, activity);

      if (flaskResult !== null) {
        console.log("Extracting place number from Flask response");
      } else {
        console.warn("No valid response from Flask.");
      }

      const finalPlaceNumber = flaskResult["place number from llm"];
      console.log(`Final place number: ${finalPlaceNumber}`);
      const matchpercentage = flaskResult["matchscore"];

      console.log("Getting place details");

      // Extract details for place
      const finalPlace = places[finalPlaceNumber];  // Directly access the place from the array NO NEED FOR places.results as we deal with that in places fetch
      const title = finalPlace.name
      const address = finalPlace.vicinity
      const photoReference = finalPlace.photos && finalPlace.photos[0]?.photo_reference 
                              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${finalPlace.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}` 
                              : "No photo available will be set to default in page.js.";
      const coordinates = finalPlace.geometry.location;
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
