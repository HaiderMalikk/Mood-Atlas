<h1 style="border-bottom: none; margin: 0; color:orange">Mood Atlas</h1>

*"Chart your feelings, discover your destination"*

---
### There is a Version of this With Way More Stuff Thast unfortunatly not in production, <a href="https://github.com/HaiderMalikk/mood-atlas" style="color: blue;">Check That Out Here</a>.

---

## Project Summary: **Mood Atlas Production Version**

**Mood Atlas** is an innovative app that recommends destinations based on user moods, places, or feelings. The project integrates multiple technologies for seamless functionality. The combination of AI and real-time data creates a personalized experience, guiding users to destinations that match their feelings. This app is expected to be released in the near future. **See the bottom of this file for the latest updates**.

- **About**:  
  - Developed with **React** and **Next.js**.  
  - Uses **Google Maps API** to display locations on a map.  
  - Fetches images and reviews via the **Google Places API** and displays them in user-friendly cards with info on the place.
  - Uses **Open AI's LLM for mood analysis** to determine the user's mood and recommend places accordingly.
  
## **Technologies Used in Mood Atlas**

- **React**: A JavaScript library for building user interfaces, primarily for creating dynamic and responsive front-end web applications.
- **Next.js**: A React-based framework that enables server-side rendering, static site generation, and other advanced web development features.
- **Google Maps API**: Provides interactive maps and location data, allowing the app to display user destinations on a map.
- **Google Places API**: Fetches information about places, such as names, addresses, reviews, and images, to enhance user experience by providing more details about recommended locations.
- **Other API's**: Uses ipapi to get the users initial location.
- **ChatGPT’s LLM (Large Language Model)**: A powerful AI language model by OpenAI used to process and generate human-like responses to user input, providing personalized recommendations.

## Project Structure
-**Not including the default Next.js files/ untouched files**
```
MOOD-ATLAS/
│
├── .next/                        # Next.js build and runtime files (this folder is the final build)
├── app/                          # main application code with all the individual files
│   ├── global.css                # contains all the css styles used throughout the app
│   ├── llm_call.js              # this is where the Open AI Api is called and also where the data sent and received, this is called and returns a place number to place processor 
│   ├── layout.js                 # defines the layout of the app i.e the header main page etc
│   ├── location_card.js          # contains the logic for displaying location cards with images etc on the map
│   ├── map.js                    # contains the main google map component 
│   ├── page.js                   # the main page of the app with all the formatting and order of components i.e where the map, location etc are and there logic along with the user inputs 
│   ├── places_fetch              # contains the logic for fetching places from google places api to give to the processor for it to forward it to flask
│   ├── places_processing.js      # this is where all the inputs are received and where we get the places send it to flask get its response and returns the result to the page
│   └── user_location.js          # This is where we get the user's initial location from ipapi api.
├── assets/                       # contains all the static assets like images etc                 # pom file containing all the imports for the springboot project                
├── utils/                        # contains utility functions used throughout the app like global colors etc
├── next.config.mjs               # contains the configuration for the next.js app like trusted domains etc
└── tailwind.config.mjs           # contains the configuration for tailwind css
```

## How the Website Works

- the user inputs the required stuff and then clicks submit, initially there location is shown on the map.
- this submitted data is propagated to the places fetch here we first fetch the nearby places by using google maps api and then we use this location data along with the user inputs to the Open AI API. We process the data and generate recommendations for the user and return it.
- this recommendations places object contain info about the places that can be parsed and extracted for things like location, address etc.
- below are some ex snippets of code detailing important parts of the process (NOT COMPLETE CODE JUST PARTS OF IT WITH PSEUDOCODE)

**Ex Data, Google Places API's nearby search returns us a json file that looks something like this, this data is needed for the website to work**

```json
{
  "name": "Residence Inn Toronto",
  {
  "place_id" : "ChIJRQoITNc0K4gRMBoATwPJLYs",
        "plus_code" : 
  },
  "vicinity" : "255 Wellington Street West, Toronto",
  "location" : 
  {
    "lat" : 43.64192569999999,
    "lng" : -79.3894923
  },
  "photos" : 
  [
    {
      "photo_reference" : "AWYs27znPtKuOjv43tZBTCFngJGTvlpvSD74iz3mXFo7trkgn8-jNhGtxP0zT8OdBpgRDLX4vih2Jvs-8PcJh_KVRfKablKQgHorz3rTNh0cqulc5R5OHjdI7JM2EwzxoCm_LSn2uKNu3Fw6MuYoFgSb-GrVlDZ2uudhal7pbx1KO3m7chFA",
    }
  ],
  {"etc etc this is not the exact format of the json file but it is something like this"}
}
```

**Open AI APi calls**

```javascript
formatplaces(places)
const response = await axios.get('/api/fetchLLMresponse', {
    params: { newplaces: JSON.stringify(newplaces), mood, hobby, activity },
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
// at /api
fucntion handler(req, res)
    const { newplaces, mood, hobby, activity } = req.query;
    const prompt = `Hey Chat Gpt do this with this info ${newplaces} ${mood} ${hobby} ${activity}`;
    // Make the API call to OpenAI
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
    });
    const message = chatCompletion;
    res.status(200).json({ result: message });
// back to main file
const result = response.data.result.choices[0].message.content;
return formatanswer(result)
```

<h2 style="border-bottom: none; margin: 0;">RADIAL OFFSET ENGINE</h1>

*Radial Offset Engine for Google Maps Places API*

*Latitude vs Longitude:*

<img src="./assets/radial.png" alt="Home" width="600" height="auto" />

---

### Overview
The Google Maps API's **nearby search** search's locations near the user, split into **20 places per page**. At each page we move outwards fetching more and more places near the user. But it would take a long time to reach the places at the ned of the users radius, this is because we would need to go though many pages to get there and takes too much time. So i found a way to overcome this limitation using my **radial offset engine** this was created to fetch places all over the users radius by searching at nearby offsets in **North (N)**, **South (S)**, **East (E)**, and **West (W)** directions. So it basically searches **n** pages at the users location before moving **N, S, E ,W** to then search **n** more places at that point, where **n** can be any number of pages you want to search at each point remembering that each page has **20 Places**. This Engine ensures that we get equal places from all over the users radius.

This engine performs **$(\text{X} \cdot \text{N})$** searches, where **N** is the number of offset locations. In our case, **N = 4** (N, S, E, W). And **X** is the number of places that we fetched at any single location, further more  **$\text{X} = \text{20} \cdot \text{n}$** where **n** is the number of pages we search at any location, as at each location we have **20 places per page**. Each additional search takes time, so the number of offsets and pages should be chosen wisely. 

After gathering all places:
1. Recursively fetch **next pages** for each location until we reach our limit.
2. Remove duplicate places before returning the final list in the case that 2 offsets have a converging radius.

---

### Offset Calculation

### 1. **Latitude Offset (Base Offset):**
   - Latitude changes by a constant distance everywhere on Earth.
   - this offset is in degrees: $1^\circ\approx 111.32 km$
   - Formula for offset:
      - $\text{latOffset} = \frac{\text{radius}}{111.32}$
   - **Example:** For a radius of **25 km**:
     - $\text{latOffset} = \frac{25}{111.32} \approx 0.224^\circ$
   - Add this offset to the user’s latitude to move **North** or subtract it to move **South**.

### 2. **Longitude Offset:**
   - Longitude offsets depend on the latitude because the Earth's radius decreases as you move toward the poles. This means we would need a smaller lng offset than our lat offset when closer to the poles, beacuse the earth shrinks as you move towards the poles, a small offset in lng is enough to cover alot of distance there.
   - Formula for longitude scaling:
     - $\text{lngScale} = \cos\left(\frac{\text{lat} \cdot \pi}{180}\right)$, Where the $\text{lat}$ is multiplied by $\left(\frac{\pi}{180}\right)$ to convert it to radiants
   - Adjusted longitude offset:
     - $\text{lngOffset} = \text{latOffset} \cdot \text{lngScale}$
   - **Example:** 
     - At the equator \( $\text{lat} = 0^\circ$ \), \( $\text{lngScale} = 1$ \), so:
       - $\text{lngOffset} = \text{latOffset}$
     - At the poles \( $\text{lat} = \pm90^\circ$ \), \( $\text{lngScale} = 0$ \), so \( $\text{lngOffset} = 0$ \).

### 3. **Recursive Fetching:**
   - For each location, fetch places for all pages (20 places per page) until the page limit is reached.

---

### Directions of Search
- **N/S**: Add or subtract the `latOffset` to/from the latitude respectively.
- **E/W**: Add or subtract the `lngOffset` to/from the longitude respectively.
---

### Coordinate Offsets Example

### Given:
- **User coordinates:**  
  - Lat: 43.6532, Lng: -79.3832  
- **Radius:** 25 km

### Step 1: Calculate Latitude Offset  
- $\text{latOffset} = \frac{\text{radius}}{111.32} = \frac{25}{111.32} \approx 0.2246^\circ$

### Step 2: Calculate Longitude Offset  
- $\text{lngScale} = \cos\left(\frac{43.6532 \times \pi}{180}\right) \approx 0.722$
- $\text{lngOffset} = 0.2246 \times 0.722 \approx 0.1622^\circ$

### Step 3: North Move (Increase Latitude)  
New Coordinates:  
- Lat: \( 43.6532 + 0.2246 = 43.8778 \)  
- Lng: -79.3832  

**North Move:** \( 43.8778, -79.3832 \)

### Step 4: East Move (Increase Longitude)  
New Coordinates:  
- Lat: 43.6532  
- Lng: \( -79.3832 + 0.1622 = -79.2210 \)

**East Move:** \( 43.6532, -79.2210 \)

### And So On for The Other Directions...
---

### Implementation Summary
1. **Base Offset:** Calculate the latitude offset using the radius:
   - $\text{latOffset} = \frac{\text{radius}}{111.32}$

2. **Longitude Adjustment:** Calculate the longitude offset by scaling the latitude offset:
   - $\text{lngOffset} = \text{latOffset} \cdot \cos\left(\frac{\text{lat} \cdot \pi}{180}\right)$

3. **Recursive Searches:** Perform up to **n** searches in the N, S, E, W directions. For each search:
   - Fetch all 20 places per page until we reach our desired page limit.
   - Remove duplicates.

4. **Final Output:** Return the unique list of places.
---

### Notes
- The engine fetches **n offsets** in N, S, E, W directions. The number of offsets can be increased by further adjusting the latitude and longitude offsets dynamically.
- Ensure all places are de-duplicated to avoid redundant results.
---

### Advantages
- Allows equal Places From all over the users radius insted of just there location without the need of long wait times.
- Can be used to find a rich set of diversly located places insted of just the ones that are close to the users location.

---
### (Pseudo Code Example)
``` javascript
// ofset calculator
const baseOffset = radius / 111.32; // dirived formula see places.fetch for dirivation
// main function to calculate ofset
function calculateOffset(userLat, baseOffset) {
  const latInRadians = (userLat * Math.PI) / 180;
  const longitudeScale = Math.cos(latInRadians); // deriving lng scale i.e the shrinking in lng from lat ofset
  const dynamicLongitudeOffset = baseOffset * longitudeScale; // new lng ofset based on base ofset 
  return {
    latOffset: baseOffset, // Latitude offset is the same regardless of the latitude
    lngOffset: dynamicLongitudeOffset, // new Longitude offset 
  };
}
const newoffset = calculateOffset(lat, baseOffset);
const latoffset = newoffset.latOffset; 
const lngoffset = newoffset.lngOffset;

// resursive call for location getting all the pages
limit = 5;
async function fetchAllPlaces(page, userinfo, allPlaces = [], pagecount=0) {
  data = getplacedata()
  allPlaces = allPlaces.concat(data)

  pagecount++

  if (pagecount == limit){
    return allPlaces;
  }

  if (data.nextpage){
    page = data.nextpage
    return fetchAllPlaces(page, userinfo, allPlaces, pagecount); // serch the same place again but next page
  }

  return allPlaces;
}

// function to serch places
async function searchWithOffset(lat, lng, direction) {
    const adjustedLat = direction === 'N' ? lat + latoffset : direction === 'S' ? lat - latoffset : lat; 
    const adjustedLng = direction === 'E' ? lng + lngoffset : direction === 'W' ? lng - lngoffset : lng;

  // get all places at new cordinates
  return fetchAllPlaces(
    page, userinfo
  );
}

// main function to get all places in the directions we want
function main(lat, lng, direction, etc){
  allresults += searchWithOfset(userlat, userlng, originaldirection)
  allresults += searchWithOfset(userlat, userlng, "N")
  // reperete for S,E,W
  reutrn removedups(allresults)
}
```

## End Goal

Create And Deploy This Project As A Web App, Giving user free access to the website along with unlimited api calls for there results (or until i run out of money)

## DEVELOPMENT IS COMPLETE 

**Current Version**
- Home page when first loading in:
<img src="./assets/firstin.png" alt="Home" width="600" height="auto" />

- After submitting the form:
<img src="./assets/afterpromt.png" alt="Home" width="600" height="auto" />
