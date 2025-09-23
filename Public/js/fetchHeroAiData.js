
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyDqQwicbZhHmyBtbMAgRZp3b6qDN5hwvzw"; // Keep this secret — don't expose in production
const genAI = new GoogleGenerativeAI(API_KEY);

async function getFactsAboutPerson(name) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Give me up to 10 interesting facts about ${name}.
    Each fact should be 2-3 sentences long.
    Return them as a JSON array of objects with "factNumber" and "factText".
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Try parsing JSON output
  let facts;
  try {
    facts = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", text);
    return;
  }

  console.log("Facts:", facts);

  // Send to backend to store in DB
  await fetch("/api/saveFacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ person: name, facts })
  });
}

// Example usage:
document.getElementById("aiButton").addEventListener("click", () => {
  const personName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
  getFactsAboutPerson(personName);
});


