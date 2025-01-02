'use client';
import axios from 'axios';

export async function fetchPlaces(userCoordinates, radius) {
  const { lat, lng } = userCoordinates;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


// ! THIS IS THE GREATEST THING IN THE WORLD I CALL IT THE RADIAL OFSET ENGINE
/* 
it basiacly hops around in the users radius and gets locations from different directions at different points (coordinates)
this measn we arent just getting all our places focused on the users location but also in the users radius

PLZ READ ABOUT THIS IN THE READ ME FILE SECTION: RADIAL OFSET ENGINE
THE CONST IS JUST IN PLACE FOR ERROR FIXING THE MATH IS NOT WRONG 

*/
 const baseOffset = radius / 111.32;
 console.log(`Base offset for radius: ${radius} is: ${baseOffset}`);
 
 function calculateOffset(userLat, baseOffset) {
   // Convert latitude to radians
   const latInRadians = (userLat * Math.PI) / 180;
   
   // Adjust the offset: scale the baseOffset by a factor derived from latitude
   // cos(latInRadians) determines the compression of longitude distances as latitude increases
   const longitudeScale = Math.cos(latInRadians);
   
   // Dynamic offset: longitude is adjusted, latitude remains constant
   const dynamicLongitudeOffset = baseOffset * longitudeScale;
   
   // Return a single value for adjustment
   return {
     latOffset: baseOffset, // Latitude offset is constant
     lngOffset: dynamicLongitudeOffset, // Longitude offset varies with latitude
    };
  }
  
  const newoffset = calculateOffset(lat, baseOffset);
  // creating vars for lan and lng offsets
  const latoffset = newoffset.latOffset; // lat is of with no ofset its ofset will corispond to radius with no addition of constant
  const lngoffset = newoffset.lngOffset;

  console.log(`Serching with new offsets: Lat offset: ${latoffset} Lng offset: ${lngoffset}`);
  
  // Recursive function to fetch all pages
  async function fetchAllPlaces(url, params, allPlaces = [], pageCount = 0) {
    const pageLimit = 1;
    try {
      // Fetch the current page of results
      const response = await axios.get(url, { params, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = response.data; // data contains places, nextpage token etc
      console.log("Response From Google Places API: ",response);

      // results is the places parts
      if (data.results && data.results.length > 0) {
        console.log(`Fetched ${data.results.length} places`);
      } else {
        console.log('No places found in the current response.');
      }

      // Append current page results to the list of all places
      allPlaces = allPlaces.concat(data.results);

      pageCount++;

      if (pageCount >= pageLimit) {
        console.log(`Page limit of ${pageLimit} reached. Stopping recursive fetch.`);
        return allPlaces;
      }

      // Check for the next page token
      if (data.next_page_token) {
        console.log('Next page token found. Waiting before fetching the next page...');
        // Wait 2 seconds before using the next_page_token (Google API requirement)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch the next page recursively
        params.pagetoken = data.next_page_token;
        return fetchAllPlaces(url, params, allPlaces, pageCount);
      }

      // Return the accumulated list of places
      return allPlaces;
    } catch (error) {
      console.error('Error fetching places:', error);
      throw new Error('Failed to fetch places from API.');
    }
  }

  // Function to remove duplicates based on place IDs
  function removeDuplicates(places) {
    const uniquePlaces = [];
    const placeIds = new Set(); // set cannot have duplicates

    for (const place of places) {
      if (!placeIds.has(place.place_id)) {
        uniquePlaces.push(place);
        placeIds.add(place.place_id);
      }
    }

    return uniquePlaces;
  }

  // Function to perform search in different directions
  // lat is the change in the N, S direction and lng is the change in the E, W direction
  async function searchWithOffset(lat, lng, direction) {
    // the option of if not N, S, E, W then adjustedLat = lat and adjustedLng = lng is for the original search
    const adjustedLat = direction === 'N' ? lat + latoffset : direction === 'S' ? lat - latoffset : lat; 
    const adjustedLng = direction === 'E' ? lng + lngoffset : direction === 'W' ? lng - lngoffset : lng;

    console.log(`Searching in direction ${direction} with coordinates: Lat=${adjustedLat}, Lng=${adjustedLng}`);

    // Initial request parameters
    const params = {
      location: `${adjustedLat},${adjustedLng}`,
      radius: radius * 1000, // Convert to meters
      key: apiKey,
    };

    return fetchAllPlaces(
      '/api/fetchPlaces',
      params
    );
  }

  // Perform searches in all directions
  const allResults = [];

  // Original location search
  allResults.push(...(await searchWithOffset(lat, lng, 'Original')));

  // North search
  allResults.push(...(await searchWithOffset(lat, lng, 'N')));

  // South search
  allResults.push(...(await searchWithOffset(lat, lng, 'S')));

  // East search
  allResults.push(...(await searchWithOffset(lat, lng, 'E')));

  // West search
  allResults.push(...(await searchWithOffset(lat, lng, 'W')));

  /* 
  // here we can have n ofsets is N,S,E,W,Original all we need to do is add a offset here to the lat or lng when we search the same direction
  // what this dose is shift the users original location, giving us a new search area and hence new places
  // it will still add the ofset but to this new users location, be careful of user radius and time for each fetch  
  */

  // Remove duplicates before returning
  const uniqueResults = removeDuplicates(allResults);

  console.log(`Finished fetching all places. Total places fetched: ${uniqueResults.length}`);
  console.log(`Total unique places fetched: ${uniqueResults.length}`);
  console.log("Unique places: ", uniqueResults);
  console.log('Returning unique places to processor...');

  return uniqueResults;
}
