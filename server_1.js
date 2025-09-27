// server.js
// Import required packages
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Use .env to manage your API key
const sequelize = require("./config/connection");
const routes = require("./routes");

// Initialize Express application
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const cors = require("cors");
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

const { GoogleGenAI } = require("@google/genai"); // Import correctly
const ai = new GoogleGenAI({ apiKey: API_KEY });
// const prompt = "Explain how AI works in a few words";

// const prompt = `
//     Give me up to 5 interesting facts about Terry Wogan.
//     Each fact should be 2-3 sentences long.
// `;


// **CHANGE 3: Get heroName from the request and build the prompt inside the route**
app.get("/generate-ai-content", async (req, res) => {
    // Read the heroName from the query string (e.g., ?heroName=...)
    const heroName = req.query.heroName;

    if (!heroName) {
        return res.status(400).json({ error: "Missing 'heroName' query parameter." });
    }

    // Build the prompt dynamically using the heroName variable
    const prompt = `
        Give me up to 5 interesting facts about ${heroName}.
        Each fact should be 2-3 sentences long.
        Please return the facts as a JSON array of objects, where each object has a single 'fact' property.
    `; // Added JSON request to get a structured array (Best Practice from previous step)

    // Optional: Define the JSON Schema here (Highly recommended for structured output)
    const FactsArraySchema = {
        type: "array",
        items: {
            type: "object",
            properties: {
                fact: { type: "string", description: "A single interesting fact, 2-3 sentences long." }
            }
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            // Add configuration for structured output
            config: {
                responseMimeType: "application/json",
                responseSchema: FactsArraySchema,
            },
        });
        
        // Since we requested JSON, the response.text is a JSON string
        const factsArray = JSON.parse(response.text.trim());

        console.log(`Generated facts for: ${heroName}`);
        
        // **CHANGE 4: Return the parsed array directly**
        res.json({ facts: factsArray });
    } catch (error) {
        console.error(`Error generating content for ${heroName}:`, error);
        res.status(500).json({ error: "Failed to generate AI content" });
    }
});

const PORT = process.env.PORT || 3001;

// has the --rebuild parameter been passed as a command line param?
const rebuild = process.argv[2] === "--rebuild";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Add routes
app.use(routes);

// Sync database
sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});

//gemini-1.5-pro
//gemini-2.5-flash
//gemini-2.0-flash-lite