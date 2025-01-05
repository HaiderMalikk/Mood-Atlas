<h1 style="border-bottom: none; margin: 0; color:orange">Mood Atlas</h1>

*"Chart your feelings, discover your destination"*

---
<h1 href="https://mood-atlas.vercel.app" style="border-bottom: none; margin: 0; color:orange" >Try Out Mood Atlas</h1>
<a href="https://mood-atlas.vercel.app" style="color: blue;">Check It Out Here
<img src="./public/link.png" alt="Home" width="50" height="auto" />
</a>


---
### There is a Version of this With Way More Stuff That's unfortunatly not in production, <a href="https://github.com/HaiderMalikk/mood-atlas" style="color: blue;">Check That Out Here</a>

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
│   ├── llm_call.js               # this is where the Open AI Api endpoint in pages/api for llm response is called, it's where the data sent and received, when this is called and returns a place number to place processor 
│   ├── layout.js                 # defines the layout of the app i.e the header main page etc
│   ├── location_card.js          # contains the logic for displaying location cards with images etc on the map
│   ├── map.js                    # contains the main google map component 
│   ├── page.js                   # the main page of the app with all the formatting and order of components i.e where the map, location etc are and there logic along with the user inputs 
│   ├── places_fetch              # contains the logic for fetching places from google places api endpoint in pages/api for places fetch and contains the radial offset engine
│   ├── places_processing.js      # this is where all the inputs are received and where we get the places send it to llmcall to get its response and returns the result to the page
│   └── user_location.js          # where the user location is fetched from the pages/api api endpoint foe getting user coordinates
├── pages/api                     # main application api endpoints (basically the server files that make api requests for us so we dont have too do it in the frondend, avoids CORS issues)
│   ├── fetchLLMresponse.js       # this is where the api call is made to the Open AI Api to get final answer 
│   ├── fetchPlaces.js            # contains the api endpoint for fetching places from google places api
│   └── fetchgcpapi.js            # Fetches GCP api keys for places and maps so we dont expose env variables to frontend
├── public/                       # contains all the static assets like images etc                
├── utils/                        # contains utility functions used throughout the app like global colors etc
├── babel.config.js               # babel config for website setting and controlling things like the console in the browser
├── next.config.mjs               # contains the configuration for the next.js app like trusted domains etc
└── tailwind.config.mjs           # contains the configuration for tailwind css
```

## How the Website Works

- the user inputs the required stuff and then clicks submit, initially there location is shown on the map.
- this submitted data is propagated to the places fetch here we first fetch the nearby places by using google maps api and then we use this location data along with the user inputs to the Open AI API. We process the data and generate recommendations for the user and return it.
- this recommendations places object contain info about the places that can be parsed and extracted for things like location, address etc.
- below are some ex snippets of code detailing important parts of the process (NOT COMPLETE CODE JUST PARTS OF IT WITH PSEUDOCODE)

---

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
  "types" : [ "hotel", "establishment" ],
  "opening_hours":
  {
    "open_now" : true,
  }
  "photos" : 
  [
    {
      "photo_reference" : "AWYs27znPtKuOjv43tZBTCFngJGTvlpvSD74iz3mXFo7trkgn8-jNhGtxP0zT8OdBpgRDLX4vih2Jvs-8PcJh_KVRfKablKQgHorz3rTNh0cqulc5R5OHjdI7JM2EwzxoCm_LSn2uKNu3Fw6MuYoFgSb-GrVlDZ2uudhal7pbx1KO3m7chFA",
    }
  ],
  {"etc etc this is not the exact format of the json file but it is something like this"}
}
```

---

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

## Overview
The Google Maps API's **nearby search** feature retrieves locations near the user, split into **20 places per page**. If we were to fetch places at a single location and rely on pagination, it would take a long time to reach locations near the edge of the user's radius. This is because we would need to go through multiple pages to cover the entire area, which is inefficient.

To overcome this limitation, I developed the **Radial Offset Engine**. This engine efficiently retrieves places distributed across the user's search radius by offsetting search locations in the **North (N)**, **South (S)**, **East (E)**, and **West (W)** directions. Instead of only searching at the user's exact location, we perform multiple searches at nearby offset points.

Each search retrieves `n` pages of results, with **20 places per page**, ensuring that locations across the entire search radius are covered effectively.

### Key Adjustments To The Offset And Search Radius:
- The offset distance is **half the user's search radius** (`radius / 2`), preventing searches from going outside the user's desired area.
- The search radius at each offset location is also **halved** (`radius / 2`), ensuring places near the edges are not missed.
- ### i could go on and on about why i made these adjustments but here is a diagram that explains it:
- If we divide the search radius and offset distance by 2:
<img src="./assets/ifdiv.jpg" alt="Home" width="600" height="auto" />


- If we DONT divide the search radius and offset distance by 2:
<img src="./assets/ifnotdiv.jpg" alt="Home" width="600" height="auto" />

This engine performs **$(\text{X} \cdot \text{N})$** searches, where:
- **N** is the number of offset locations. In this case, **N = 4** (N, S, E, W).
- **X** is the number of places retrieved at each location.
- Since each page contains 20 places, we define:
  - **$\text{X} = \text{20} \cdot \text{n}$**, where **n** is the number of pages searched per location.

After gathering all places:
1. **Recursively fetch next pages** for each location until the page limit is reached.
2. **Remove duplicate places** to avoid redundant results in cases where two offsets overlap.

---

## Offset Calculation

### 1. **Latitude Offset (Base Offset)**
   - Latitude changes uniformly everywhere on Earth.
   - Offset in degrees: $1^\circ \approx 111.32 \text{ km}$
   - **Formula for base latitude offset:**
      - $\text{latOffset} = \frac{\text{radius}}{2 \times 111.32}$
   - **Example:** For a search radius of **25 km**:
     - $\text{latOffset} = \frac{25}{2 \times 111.32} \approx 0.112^\circ$
   - This offset is added or subtracted from the user’s latitude to move **North or South**.

### 2. **Longitude Offset**
   - Longitude offsets depend on latitude because the Earth's radius decreases as you move toward the poles.
   - Formula for longitude scaling:
     - $\text{lngScale} = \cos\left(\frac{\text{lat} \cdot \pi}{180}\right)$, Where the $\text{lat}$ is multiplied by $\left(\frac{\pi}{180}\right)$ to convert it to radiants
   - Adjusted longitude offset:
     - $\text{lngOffset} = \text{latOffset} \cdot \text{lngScale}$
   - **Example:**
     - At the equator \( $\text{lat} = 0^\circ$ \), \( $\text{lngScale} = 1$ \), so:
       - $\text{lngOffset} = \text{latOffset}$
     - At 43.6532° (Toronto):
       - $\text{lngScale} = \cos\left(\frac{43.6532 \times \pi}{180}\right) \approx 0.722$
       - $\text{lngOffset} = 0.112 \times 0.722 \approx 0.081^\circ$

### 3. **Recursive Fetching**
   - At each location, retrieve all **n** pages of places (20 per page) before moving to the next offset.

---

## Directions of Search
- **N/S:** Add or subtract `latOffset` to/from latitude.
- **E/W:** Add or subtract `lngOffset` to/from longitude.

---

## Example: Coordinate Offsets

### Given:
- **User coordinates:**  
  - Lat: `43.6532`, Lng: `-79.3832`  
- **Radius:** `25 km`

### Step 1: Calculate Latitude Offset  
- $\text{latOffset} = \frac{\text{radius}}{2 \times 111.32} = \frac{25}{2 \times 111.32} \approx 0.112^\circ$

### Step 2: Calculate Longitude Offset  
- $\text{lngScale} = \cos\left(\frac{43.6532 \times \pi}{180}\right) \approx 0.722$
- $\text{lngOffset} = 0.112 \times 0.722 \approx 0.081^\circ$

### Step 3: North Move (Increase Latitude)  
New Coordinates:  
- Lat: \( 43.6532 + 0.112 = 43.7652 \)  
- Lng: `-79.3832`  

**North Move:** \( 43.7652, -79.3832 \)

### Step 4: East Move (Increase Longitude)  
New Coordinates:  
- Lat: `43.6532`  
- Lng: \( -79.3832 + 0.081 = -79.3022 \)

**East Move:** \( 43.6532, -79.3022 \)

**And So on For All Other Directions Including The Original Coordinates**

---

## Implementation Summary
1. **Base Offset Calculation:**  
   - $\text{latOffset} = \frac{\text{radius}}{2 \times 111.32}$
   - $\text{lngOffset} = \text{latOffset} \times \cos\left(\frac{\text{lat} \times \pi}{180}\right)$

2. **Recursive Searches:**  
   - At each offset location, search up to **n** pages.
   - Remove duplicate places.

3. **Final Output:**  
   - Return the unique list of places.

---

## Advantages
- **Uniform Place Distribution:** Ensures an equal number of places are retrieved from all over the search radius.
- **Efficient Coverage:** Reduces the number of pages needed to fetch distant places.
- **Avoids Overshooting:** Ensures searches do not go outside the user's radius.

---
### (Pseudo Code Example)
``` javascript
// ofset calculator
function fetchPlaces(userCoordinates, radius){
  const baseOffset = (radius/2) / 111.32; // dirived formula and divide radius by 2
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
    data = getplacedata() // api endpoint that gets all places from google maps api
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
      page, 

      userinfo = {
      location: `${adjustedLat},${adjustedLng}`,
      radius: (radius * 1000) / 2, // Convert to meters and divide by 2 
      key: apiKey,
      };
    );
  }

  // main function to get all places in the directions we want
  function main(lat, lng, direction, etc){
    allresults += searchWithOfset(userlat, userlng, originaldirection)
    allresults += searchWithOfset(userlat, userlng, "N")
    // reperete for S,E,W
    reutrn removedups(allresults)
  }
}
```

## End Goal

Create And Deploy This Project As A Web App, Giving user free access to the website along with unlimited api calls for there results (or until i run out of money)

## DEVELOPMENT IS COMPLETE 

**Current Version**
- Home page when first loading in:
<img src="./public/firstin.png" alt="Home" width="600" height="auto" />

- After submitting the form:
<img src="./public/afterpromt.png" alt="Home" width="600" height="auto" />

- Open AI usage dashboard:
<img src="./public/openai.png" alt="Home" width="600" height="auto" />

- Google's GCP usage dashboard:
<img src="./public/gcp.png" alt="Home" width="600" height="auto" />
