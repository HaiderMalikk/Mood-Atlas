'use client';

export async function fetchFlaskData(places, mood, hobby, activity) {
  console.log("Getting response from LLM");
  const data = {"place number from llm": 0, "matchscore": 100};
  console.log("Data received from LLM: sending to proccess file. Data from LLM:", data);
  return data;
}
