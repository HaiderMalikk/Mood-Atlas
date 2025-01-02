// /pages/api/fetchLLMresponse.js

import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { places, mood, hobby, activity } = req.query; // Extract parameters from the client-side request
  console.log("Received OpenAI fetch request with query:", req.query);

  try {
    // Construct the prompt
    const prompt = `
      Respond if you are there
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
