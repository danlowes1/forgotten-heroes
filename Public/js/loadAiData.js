// Public/js/loadAiData.js
document.addEventListener('DOMContentLoaded', () => {
    // A reference to the AI button
    const aiButton = document.getElementById('aiButton');
    const messageContainer = document.getElementById('messageContainer');
    const contentContainer = document.getElementById('contentContainer');

    // Get the current page's file name from the URL pathname
    const fullPath = window.location.pathname;
    const fileNameWithExtension = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    
    // Remove the file extension and replace hyphens with spaces
    let heroName = fileNameWithExtension.split('.')[0].replace(/-/g, ' ');

    // The API endpoint URL
    const apiUrl = `http://localhost:3001/api/hero_ai_finds/by-hero-name/${encodeURIComponent(heroName)}`;

    // The API endpoint for your Gemini content
    //const geminiApiUrl = 'http://localhost:3001/generate-ai-content';
    const geminiApiUrl = `http://localhost:3001/generate-ai-content?heroName=${encodeURIComponent(heroName)}`;

    aiButton.addEventListener('click', function(event) {
        event.preventDefault();




        
        contentContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        const originalText = aiButton.textContent;

        // Disable the button
        aiButton.disabled = true;
        aiButton.style.pointerEvents = 'none';

        // Show spinner instead of countdown
        aiButton.innerHTML = '<span class="spinner"></span>';

        // Show loading message after 1 second
        setTimeout(() => {
            messageContainer.innerHTML = '<p class="text-gray-500">Loading AI finds...</p>';
        }, 1000);

        // getFactsAboutPerson(heroName);

        // Wait 3 seconds total before fetching data
        setTimeout(async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                
                // Log the response from your Gemini backend
                const responseAi = await fetch(geminiApiUrl);
                if (!responseAi.ok) throw new Error(`HTTP error! status: ${responseAi.status}`);
                const dataAi = await responseAi.json();

                console.log("Response from your Gemini backend:", dataAi.text);

                if (Array.isArray(data) && data.length > 0) {
                    messageContainer.innerHTML = ''; // Clear loading message
                    data.slice(0, 5).forEach(item => {
                        const contentCard = document.createElement('div');
                        contentCard.className = 'content-card';
                        contentCard.textContent = item.content;
                        contentContainer.appendChild(contentCard);
                    });
                } else {
                    messageContainer.innerHTML = '<p class="text-gray-500">No content found for this hero.</p>';
                }
            } catch (error) {
                console.error('Fetch error:', error);
                messageContainer.innerHTML = `<p class="text-red-500">Failed to load content. Error: ${error.message}</p>`;
            }

            // Reset button back to original state
            aiButton.innerHTML = originalText;
            aiButton.disabled = false;
            aiButton.style.pointerEvents = 'auto';
        }, 3000); // 3 second pause
    });
});


async function  getFactsAboutPerson(name) {


    console.log(name);

    const { GoogleGenAI } = require("@google/genai"); // Import correctly
    const API_KEY = "AIzaSyDp3Nywb916n6Efwh4qu72dPI4yZBOo2dA";
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = `
        Give me up to 10 interesting facts about ${name}.
        Each fact should be 2-3 sentences long.
        Return them as a JSON array of objects with "factNumber" and "factText".
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("Response text:", response.text);

}






// // import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// // const API_KEY = "YOUR_GEMINI_API_KEY"; // Keep this secret — don't expose in production
// // const genAI = new GoogleGenerativeAI(API_KEY);

// // async function getFactsAboutPerson(name) {
// //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //   const prompt = `
// //     Give me up to 10 interesting facts about ${name}.
// //     Each fact should be 2-3 sentences long.
// //     Return them as a JSON array of objects with "factNumber" and "factText".
// //   `;

// //   const result = await model.generateContent(prompt);
// //   const text = result.response.text();

// //   // Try parsing JSON output
// //   let facts;
// //   try {
// //     facts = JSON.parse(text);
// //   } catch (e) {
// //     console.error("Failed to parse JSON from Gemini:", text);
// //     return;
// //   }

// //   console.log("Facts:", facts);

// //   // Send to backend to store in DB
// //   await fetch("/api/saveFacts", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ person: name, facts })
// //   });
// // }