'use client';
import axios from 'axios';

export async function fetchLLMresponse(places, mood, hobby, activity) {
  console.log("Sending request to backend API for OpenAI response");

  try {
    const response = await axios.get('/api/fetchLLMresponse', {
      params: { places, mood, hobby, activity },
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    console.log("Response from backend API:", response);
    //return response.data; // Return the result from the API response

    const data2 = { "place number from llm": 0, "matchscore": 100 };
    console.log("Data received from LLM: sending to process file. Data from LLM:", data2);
    return data2;

  } catch (error) {
    console.error("Error fetching data from backend API:", error);
    throw error; // Re-throw the error for further handling
  }
}
