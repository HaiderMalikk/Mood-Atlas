// /pages/api/fetchLLMresponse.js

import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { newplaces, mood, hobby, activity } = req.query; // Extract parameters from the client-side request
  console.log("Received OpenAI fetch request with query:", req.query);

  try {
    // Construct the prompt
    const prompt = `
        You are a place selector your job is to find a place for the attributes of the user which are as follows:
            Users Mood: ${mood}, Users Hobbies: ${hobby}, Users Activities: ${activity}
            IF ANY OF THE ATTRIBUTES ARE N/A THAT MEANS THE USER DID NOT PROVIDE IT, ASSUME IT'S THE SAME IF ITS BLANK
            IF YOU ARE NOT GIVEN ONE OR MORE OF THE ABOVE ATTRIBUTES RETURN YOU BEST GUESS EVEN IF YOU ARE GIVEN NO ATTRIBUTES

            You are also given a key value pair as follows: Key = place number and Value = place name. 
            Your job is too find the best place for the user based on the given attributes.
            you do this by looking at the name of the place which is the value.
            When you find the right place return its key your answer must be a single integer in the range of keys given in the problem.
            then you must return a match score from 0-100 which is the score of how well the place matches the user.
            this score must be separated by a commas 
            the final answer will be in the following format: key, match_score
            
            YOU MUST RETURN A VALID INTEGER AND NOTHING ELSE, EVEN IF THE USER HAS NO MATCHING PLACE RETURN YOU BEST GUESS. ALSO RETURN A MATCH PERCENTAGE EVEN IF ITS 0
            JUST FOR YOU REFERENCE THE MAX NUMBER YOU CAN GOTO IS THE MAX NUMBER OF OBJECTS IN THE LIST OF PLACES WHICH IS: ${newplaces.length}
            
            NOTE: avoid places like: Hotels
            PLACES LIKE HOTELS HAVE WORDS IN THERE NAME LIKE: HOTEL, MOTEL, INN, RESORT, RESIDENCE, RESIDENCY, SUITE.
            ALSO LOOK OUT FOR POPULAR HOTEL CHAINS LIKE: HILTON, MARRIOTT, HYATT, SHERATON, WESTIN, RITZ, FOUR SEASONS, FAIRMONT, INTERCONTINENTAL.
            THERE MIGHT BE OTHER KEYWORDS OR CHAINS TO LOOK OUT FOR SO BE CAREFUL.
            
            Here is the list of places:
            ${newplaces}
    `;

    // Make the API call to OpenAI
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    });

    // Return the result
    const message = chatCompletion;
    res.status(200).json({ result: message });
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI API.' });
  }
}
