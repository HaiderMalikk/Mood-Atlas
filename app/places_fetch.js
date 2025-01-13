'use client';
import axios from 'axios';

export async function fetchPlaces(userCoordinates, radius, gonow) {
  const { lat, lng } = userCoordinates;
  console.log("Getting API key from GCP API");

  // ! THIS IS THE GREATEST THING IN THE WORLD I CALL IT THE RADIAL OFSET ENGINE
  /* 
  it basiacly hops around in the users radius and gets locations from different directions at different points (coordinates)
  this measn we arent just getting all our places focused on the users location but also in the users radius

  PLZ READ ABOUT THIS IN THE READ ME FILE SECTION: RADIAL OFSET ENGINE
  THE CONST IS JUST IN PLACE FOR ERROR FIXING THE MATH IS NOT WRONG 
  */
  const baseOffset = (radius / 2) / 111.32; // devide by 2 see readme for why
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
  // creating vars for lat and lng offsets
  const latoffset = newoffset.latOffset;
  const lngoffset = newoffset.lngOffset;

  console.log(`Searching with new offsets: Lat offset: ${latoffset} Lng offset: ${lngoffset}`);
  
  // Function to remove duplicates based on displayName
  function removeDuplicates(places) {
    console.log("Removing duplicates based on displayName");
    const uniquePlaces = [];
    const placeNames = new Set();
  
    for (const place of places) {
      // Ensure displayName exists before accessing its text
      if (place && place.displayName.text && !placeNames.has(place.displayName.text)) {
        uniquePlaces.push(place);
        placeNames.add(place.displayName.text);
      }
    }
  
    return uniquePlaces;
  }
  

  function removeclosedplaces(places) {
    if (gonow) {
      console.log("Removing closed places");
      // Filter out places that are not open
      return places.filter(place => place.opening_hours && place.opening_hours.open_now);
    }
    // If gonow is false, return the places as is
    return places;
  }

  // Function to perform search in different directions
  // lat is the change in the N, S direction and lng is the change in the E, W direction
  // this logic decides the direction of the search
  async function searchWithOffset(lat, lng, direction) {
    const adjustedLat = direction === 'N' ? lat + latoffset : direction === 'S' ? lat - latoffset : 
                        direction === 'NE' ? lat + latoffset : 
                        direction === 'SE' ? lat - latoffset :
                        direction === 'SW' ? lat - latoffset :
                        direction === 'NW' ? lat + latoffset : lat; 
    
    const adjustedLng = direction === 'E' ? lng + lngoffset : direction === 'W' ? lng - lngoffset : 
                        direction === 'NE' ? lng + lngoffset : 
                        direction === 'SE' ? lng + lngoffset : 
                        direction === 'SW' ? lng - lngoffset : 
                        direction === 'NW' ? lng - lngoffset : lng;

    console.log(`Searching in direction ${direction} with coordinates: Lat=${adjustedLat}, Lng=${adjustedLng}`);

    // Initial request parameters
    const params = {
      lat: adjustedLat,
      lng: adjustedLng,
      radius: (radius * 1000) / 2, // Convert to meters and divide by 2 for half the radius see read me for more info
    };

    // call api with the new parameters
    try {
      const response = await axios.get('/api/fetchPlaces', { params, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = response.data; // data contains places

      if (data.places && data.places.length > 0) {
        console.log(`Fetched ${data.places.length} places in ${direction} direction.`);
      } else {
        console.log('No places found in the current response.');
      }

      return data.places || [];
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
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

  // North-East search
  allResults.push(...(await searchWithOffset(lat, lng, 'NE')));

  // South-East search
  allResults.push(...(await searchWithOffset(lat, lng, 'SE')));

  // South-West search
  allResults.push(...(await searchWithOffset(lat, lng, 'SW')));

  // North-West search
  allResults.push(...(await searchWithOffset(lat, lng, 'NW')));

  /* 
  // here we can have n ofsets is N,S,E,W,Original, NE, SE, SW, NW all we need to do is add a offset here to the lat or lng when we search the same direction
  // what this dose is shift the users original location, giving us a new search area and hence new places
  // it will still add the ofset but to this new users location, be careful of user radius and time for each fetch  
  */

  // Remove duplicates before returning
  const uniqueResults = removeDuplicates(allResults);
  // remove closed places
  const finalResults = uniqueResults;

  console.log(`Finished fetching all places. Total places fetched: ${allResults.length}`);
  console.log(`Total unique places fetched: ${finalResults.length}`);
  console.log("Unique places: ", finalResults);
  console.log('Returning unique places to processor...');

  return finalResults;
}
