// Public/js/loadAiData.js
document.addEventListener('DOMContentLoaded', () => {
    const aiButton = document.getElementById('aiButton');
    const messageContainer = document.getElementById('messageContainer');
    const contentContainer = document.getElementById('contentContainer');

    const fullPath = window.location.pathname;
    const fileNameWithExtension = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    
    let heroName = fileNameWithExtension.split('.')[0].replace(/-/g, ' ');
  
    heroName = heroName.toLowerCase().replace(/\b\w/g, (char) => {
        return char.toUpperCase();
    });


    // const apiUrl = `http://localhost:3001/api/hero_ai_finds/by-hero-name/${encodeURIComponent(heroName)}`;

    const geminiApiUrl = `http://localhost:3001/generate-ai-content?heroName=${encodeURIComponent(heroName)}`;

    aiButton.addEventListener('click', async function(event) {
        event.preventDefault();

        let heroId , heroRecord, apiUrl;
        const originalText = aiButton.textContent;

        contentContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        // Disable the button
        aiButton.disabled = true;
        aiButton.style.pointerEvents = 'none';

        // Show spinner instead of countdown
        aiButton.innerHTML = '<span class="spinner"></span>';

        // Show loading message after 1 second
        setTimeout(() => {
            messageContainer.innerHTML = '<p class="text-gray-500">Loading AI finds...</p>';
        }, 1000);

        const dataHero = { hero_name: heroName };
        try {
            // 2. Call the POST endpoint
            const response = await fetch("http://localhost:3001/api/heroes/find-or-create", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", // Important: Tells the server to expect JSON
                },
                // Convert the JavaScript object to a JSON string
                body: JSON.stringify(dataHero),
            });

            // Check if the network request was successful (status 200-299)
            if (!response.ok) {
                // Throw an error if the status code indicates a problem (e.g., 500)
                const errorData = await response.json();
                throw new Error(`API Error (${response.status}): ${errorData.error || errorData.message}`);
            }

            // 3. Process the JSON response
            const result = await response.json();

            // Return the hero object from the response (it contains the ID!)
            heroRecord = result.hero;
            heroId = heroRecord.id; // Extract the ID

        } catch (error) {
            console.error("Error during find or create operation:", error.message);
            // return null; 
        }

        console.log("Hero ID:", heroId);

        // Wait 3 seconds total before fetching data
        setTimeout(async () => {
            try {
                apiUrl = `http://localhost:3001/api/hero_ai_finds/by-hero-id/${heroId}`;
                const response = await fetch(apiUrl);
                // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); // removed as error handled in route

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