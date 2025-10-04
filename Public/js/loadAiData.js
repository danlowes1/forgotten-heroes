// Public/js/loadAiData.js
document.addEventListener('DOMContentLoaded', () => {
    const aiButton = document.getElementById('aiButton');
    const messageContainer = document.getElementById('messageContainer');
    const contentContainer = document.getElementById('contentContainer');

    const fullPath = window.location.pathname;
    const fileNameWithExtension = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    const elmHeader1 = document.querySelector("h1");

    const fileName = fileNameWithExtension.split('.')[0].replace(/-/g, ' ');
  
    const heroName = fileName.toLowerCase().replace(/\b\w/g, (char) => {
        return char.toUpperCase();
    });

    // 1. Get the contents of the first <h1>
    // const firstHeader = document.querySelector("h1")?.textContent.trim();
    const firstHeader =  elmHeader1?.textContent.trim();
    
    console.log("First header:", firstHeader);

    // 2. Get all <p> contents as plain text
    const paragraphs = Array.from(document.querySelectorAll("p")).map(p => p.textContent.trim());
    // console.log("Paragraphs:", paragraphs);

    // const apiUrl = `http://localhost:3001/api/hero_ai_finds/by-hero-name/${encodeURIComponent(heroName)}`;

    const geminiApiUrl = `http://localhost:3001/generate-ai-content?heroName=${encodeURIComponent(firstHeader)}`;

    aiButton.addEventListener('click', async function(event) {
        let heroId , heroRecord, apiUrl;
        const originalText = aiButton.textContent;

        event.preventDefault();

        console.log("AI Button clicked fileName:", fileName);
        if (fileName === 'ai info') {
            // We are not on a hero page we are on the ai-info.html page
            const res = await fetch("/api/heroes/random");

            // const res = await fetch("http://127.0.0.1:3001/api/heroes/random");

            const data = await res.json();
            const randomHeroName = data.RandomHeroName;
            elmHeader1.textContent = randomHeroName;
            console.log("Random hero name:", randomHeroName);   
        }

        contentContainer.innerHTML = '';
        messageContainer.innerHTML = '';

        // Disable the button
        aiButton.disabled = true;
        aiButton.style.pointerEvents = 'none';

        // Show spinner instead of countdown
        aiButton.innerHTML = '<span class="spinner"></span>';

        // Show loading message after 1 second
        setTimeout(() => {
            messageContainer.innerHTML = '<p class="text-gray-500">AI searching for updates...</p>';
        }, 500);

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
                let response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Server failed to process request. Status: ${response.status}`);
                let data = await response.json();

                // If no data found, ask Gemini to generate
                if (data.length === 0) {
                    const responseAi = await fetch(geminiApiUrl);
                    if (!responseAi.ok) throw new Error(`HTTP error! status: ${responseAi.status}`);
                    const dataAi = await responseAi.json();

                    if (dataAi && dataAi.length > 0) {
                        try {
                            // Save all AI facts in parallel
                            await Promise.all(
                                dataAi.map(async (item, index) => {
                                    console.log(`Fact #${index + 1}: ${item}`);
                                    const saveUrl = 'http://localhost:3001/api/hero_ai_finds';
                                    const payload = { content: item, hero_id: heroId };

                                    const saveResponse = await fetch(saveUrl, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload)
                                    });

                                    if (!saveResponse.ok) {
                                        const errorDetails = await saveResponse.json();
                                        throw new Error(
                                            `Failed to save fact. Status: ${saveResponse.status}. Message: ${errorDetails.message || 'Unknown server error'}`
                                        );
                                    }

                                    const savedRecord = await saveResponse.json();
                                    console.log("Fact saved successfully. Record ID:", savedRecord.id);
                                })
                            );

                            // Only runs once ALL saves are complete (becuase of await Promise.all)
                            console.log("Re-fetching data after AI generation...");
                            response = await fetch(apiUrl);
                            if (!response.ok) throw new Error(`Server failed to process request. Status: ${response.status}`);
                            data = await response.json();
                            console.log("Data after AI generation length:", data.length);

                        } catch (error) {
                            console.error("Error while saving AI facts:", error.message);
                        }
                    } else {
                        console.log("AI query was successful, but no facts were returned.");
                    }
                }

                // Render results
                if (Array.isArray(data) && data.length > 0) {
                    messageContainer.innerHTML = '';
                    data.slice(0, 10).forEach(item => {
                        const contentCard = document.createElement('div');
                        contentCard.className = 'content-card';
                        contentCard.textContent = item.content;
                        contentContainer.appendChild(contentCard);
                    });
                } else {
                    messageContainer.innerHTML = '<p class="text-gray-500">No content found for this hero.</p>';
                }
            } catch (error) {
                console.error("Error during AI fetch/save flow:", error.message);
            } finally {
                // Reset button back to original state
                aiButton.innerHTML = originalText;
                aiButton.disabled = false;
                aiButton.style.pointerEvents = 'auto';
            }
        }, 2999);

    });
});


// document.getElementById('findOutMoreBtn').addEventListener('click', function() {
//   const explanation = document.getElementById('aiExplanation');
//   const btn = this;
//   const icon = btn.querySelector('.btn-icon');
//   const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  
//   console.log("Button clicked. Current expanded state:");

//   if (isExpanded) {
//     explanation.hidden = true;
//     btn.setAttribute('aria-expanded', 'false');
//     icon.textContent = '▼';
//     btn.querySelector('.btn-text').textContent = 'Find out more';
//   } else {
//     explanation.hidden = false;
//     btn.setAttribute('aria-expanded', 'true');
//     icon.textContent = '▲';
//     btn.querySelector('.btn-text').textContent = 'Show less';
//   }
// });


function aiResultsHeader () {

    return `<div class="ai-results-container">
        <div class="ai-results-header">
            <p class="ai-intro-text">Thesse are the latest finds from the AI...</p>
            <button class="find-out-more-btn" id="findOutMoreBtn" aria-expanded="false">
            <span class="btn-text">Find out more</span>
            <span class="btn-icon" aria-hidden="true">▼</span>
            </button>
        </div>

        <div class="ai-explanation" id="aiExplanation" hidden>
            <h3>How This Works</h3>
            <p>
            This website uses <strong>Gemini 2.5 Flash AI</strong> to discover the latest information about <span class="hero-name-placeholder">${heroName}</span>. 
            Think of it as having a research assistant that can instantly search through vast amounts of recent information 
            to find interesting facts that might have been buried or forgotten.
            </p>
            <p>
            When you click the "AI Update" button, the AI scans news articles, interviews, recent publications, and other 
            sources to uncover lesser-known details about this person's life, career, or current activities. It's like 
            asking a knowledgeable friend "What's something fascinating about this person that most people don't know?" 
            and getting an answer in seconds.
            </p>
            <p>
            <strong>New to AI?</strong> This is a perfect example of how artificial intelligence can make everyday tasks easier. 
            Instead of spending hours searching through multiple websites, the AI does the heavy lifting for you, pulling 
            together intriguing facts you might never have found on your own.
            </p>
            <p class="ai-disclaimer">
            <em>For those familiar with AI:</em> Yes, this is a straightforward prompt-based query—nothing groundbreaking. 
            But that's exactly the point! This feature is designed to show newcomers how AI can be genuinely useful 
            for simple, practical tasks like this. Sometimes the best demonstration of technology is just showing it 
            working in a real, everyday context.
            </p>
        </div>`

}

// Not in use
async function  getFactsAboutPerson(name) {


    console.log(name);

    const { GoogleGenAI } = require("@google/genai"); // Import correctly
    const API_KEY = "xxxxxxxxxxxxxxxxxxx";
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



// 

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