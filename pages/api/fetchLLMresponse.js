// /pages/api/fetchLLMresponse.js

import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.MY_SECRET_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { newplaces, mood, hobby, activity } = req.query; // Extract parameters from the client-side request
  console.log("Received OpenAI fetch request with query:", req.query);

  try {
    // Construct the prompt
    const prompt = `
       You are a place recommender designed to suggest the best place based on a user's preferences. Your task is to find the ideal place for a user based on the following attributes:

      - User's Mood: ${mood}
      - User's Hobbies: ${hobby}
      - User's Activities: ${activity}

      If any of these attributes are missing or not provided, assume they are blank or N/A and make your best guess. If the user provides no attributes, rely on your own judgment to suggest a place.

      You are given a dictionary where the key is the place number and the value contains information about each place in the following format:

      - 'name': The name of the place (e.g., 'Central Park')
      - 'type': A comma-separated list of types (e.g., 'park, outdoor, nature')

      Your goal is to suggest the best place based on the user's attributes. To do this, you should analyze the place's name and types. The types provide information about what kind of place it is (e.g., park, restaurant, museum). Match these attributes with the user's provided mood, hobbies, and activities to find the most suitable place.

      After identifying the best place, return the following:
      1. The place's key (index number).
      2. A match score, which is a percentage (0-100), indicating how well the place matches the user's preferences.

      Your answer should be in the format:
      key, match_score
      YOUR ANSWER MUST BE IN THIS FORMAT NO MATTER WHAT.
      YOU MUST RETURN A VALID INTEGER AND NOTHING ELSE, EVEN IF THE USER HAS NO MATCHING PLACE RETURN YOU BEST GUESS. 
      SAME FOR THE MATCH SCORE.

      For reference, you can only choose a place from the given list. The maximum possible index value is ${Object.keys(newplaces).length}.

      Here is the list of places with their details:
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
