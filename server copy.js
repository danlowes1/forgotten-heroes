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

const contactRoute = require("./routes/contact");
app.use("/api", contactRoute);


// CORS setup
const cors = require("cors");
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;

const { GoogleGenAI } = require("@google/genai"); // Import correctly
const ai = new GoogleGenAI({ apiKey: API_KEY });


// Gemini ai content generation 
app.get("/generate-ai-content", async (req, res) => {
    const heroName = req.query.heroName;

    if (!heroName) {
        return res.status(400).json({ error: "Missing 'heroName' query parameter." });
    }

    const prompt = `
        Give me up to 5 interesting facts about ${heroName}.
        Each fact should be 2-3 sentences long.
        They only shoud be facts that are not commonly known. They can be things like where are they now, what are they doing, what is something interesting about their life that most people don't know.
        If you can't come up with 5, just give me what you can.
    `;

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
            config: {
                responseMimeType: "application/json",
                responseSchema: FactsArraySchema,
            },
        });

        console.log("1. Response text:", response.text);

        // Parse JSON and flatten into an array of strings
        const factsArray = JSON.parse(response.text).map(item => item.fact);

        res.json(factsArray); // return ["fact1", "fact2", "fact3", ...]

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

// server.js (near the bottom, before app.listen)
function listRoutes(app) {
  console.log("Registered routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route;
        if (route) {
          console.log(`${Object.keys(route.methods)} ${route.path}`);
        }
      });
    }
  });
}

listRoutes(app);


// Sync database
sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});

//gemini-1.5-pro
//gemini-2.5-flash
//gemini-2.0-flash-lite
