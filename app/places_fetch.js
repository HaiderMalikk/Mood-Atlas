'use client';
import axios from 'axios';

export async function fetchPlaces(userCoordinates, radius) {
  const { lat, lng } = userCoordinates;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


// ! THIS IS THE GREATEST THING IN THE WORLD I CALL IT THE RADIAL OFSET ENGINE
// basically it accounts for the fact that google maps api only lets you have 60 places per request whcich dose not cover the whole radius of user input

    // Offset value for directional search (in degrees) this dictates how much we move N, S, E, W by from the original point (usercoordinates)
  // lat and lng are sensitive to direction a small cahnge can move you by a significant amount hence keep it small
  // NOTE!
  /* 
  EX:
    An offset of 0.001 latitude is ~111 meters everywhere.
    An offset of 0.001 longitude is ~111 meters at the equator but decreases as you move towards the poles.
  */
  /* 
  hence we must find a function that accounts for this i.e if the user has a small or large lat meaning there closer or further from the equator
  then there closer or further from the poles and hence we must account for this when making the offset
  the ofset will be the same ammount in the north and south i.e no matter the lat it doeent effect the distance of N, S movement
  but it dose the E, W movement so we need to account for this
  So we will return a modified offset for lng (e,w) while the base offset is for N,S (north,south) will be the same as the lat offset

  SOL:
  lng offset = base offset * Math.cos(latInRadians) 
  this factor scales the longitude offset appropriately. 
  At the equator (latitude = 0), cos(0) = 1, so the longitude offset is equal to the base offset. 
  At the poles (latitude = ±90), cos(±90) = 0, so the longitude offset becomes 0, 
  which is correct since longitude lines converge at the poles.

  - BASE OFFSET:
  as for the base ofset a this determines how much we move our cordinates N, S, E, W i.e how many meters we move in any direction
  once we move to that new point we serch for places in that area again so this is important to account for
  a large ofset means we move more and get unique places, moving a small amout means our radius converges and incetcepts with the last search
  this means less places and hence less unique places

  BUT the user have a radius option and so we cannot increase the radius too much or we will get too many places outside our radius
  to figure this out i will use the ofset conversion to meters and then use that along with the radius to make a function like so
  NOTE: like mentioned before the ofset for lng is different from that for lat but since the function will account for this
  we can start off with a base ofset that is the ofset we want fot thr lat and the function will adjust it for the lng accordingly

  1 ofset i.e lat + 1 = lat + 111 km, 0.1 = 11km, 0.001 = 0.111km
  so if we want n km added to our lat then we can use the following formula
  km to add = ofset * 111km
  so if i want 11km i do 0.111 * 111km = 11km
  solving for ofset we get: ofset = km to add / 111km
  the km to add should be the radius ! DONE!
  so for a radius of 25km our ofset should be 25km / 111km = 0.2252

  as we move towards the poles 1 deg of lng is shorter than at the equator hence the lng ofset will be smaller than the lat ofset in most cases
  i.e the change in lng covers a smaller distance than the same change in lng at the equator

  BUT ! BUT ! theres a problem in real life the new lng ofset is a bit off from real life 
  hence i must add to either the radius or add a constant
  so after testing with online maps and radius i came up with a constant to add to the base ofset calculations 
  watch the yt vid for how i came up with everything
  Everything so far is as follows:
  */
 const baseOffset = radius / 111;
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
  const range_filler_constant_lng = 0.15; // adding a constant to the lng offset to make it complete
  const latoffset = newoffset.latOffset; // lat is of with no ofset its ofset will corisponf to radius with no addition of constant
  const lngoffset = newoffset.lngOffset + range_filler_constant_lng;

  console.log(`Serching with new offsets: Lat offset: ${latoffset} Lng offset: ${lngoffset}`);
  
  // Recursive function to fetch all pages
  async function fetchAllPlaces(url, params, allPlaces = []) {
    try {
      // Fetch the current page of results
      const response = await axios.get(url, { params, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = response.data;

      if (data.results && data.results.length > 0) {
        console.log(`Fetched ${data.results.length} places`);
      } else {
        console.log('No places found in the current response.');
      }

      // Append current page results to the list of all places
      allPlaces = allPlaces.concat(data.results);

      // Check for the next page token
      if (data.next_page_token) {
        console.log('Next page token found. Waiting before fetching the next page...');
        // Wait 2 seconds before using the next_page_token (Google API requirement)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Fetch the next page recursively
        params.pagetoken = data.next_page_token;
        return fetchAllPlaces(url, params, allPlaces);
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
      'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json',
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
