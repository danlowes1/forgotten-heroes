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

// const contactRoute = require("./routes/contact");
// app.use("/api", contactRoute);
app.use("/api", routes);

// CORS setup
const cors = require("cors");
app.use(cors());

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST"],
}));



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
        They only should be facts that are not commonly known. They can be things like where are they now, what are they doing, what is something interesting about their life that most people don't know.
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
// app.use(routes);
app.use("/api", routes);

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

// app.get("/generate-ai-content", async (req, res) => {
//     const heroName = req.query.heroName;

//     if (!heroName) {
//         return res.status(400).json({ error: "Missing 'heroName' query parameter." });
//     }

//     // You can now make the main prompt simpler since the System Instruction handles the persona.
//     const prompt = `
//         Provide up to 5 interesting facts about ${heroName}, following all constraints in the System Instruction.
//     `;

//     // The FactsArraySchema remains exactly the same as it correctly defines your desired output.
//     const FactsArraySchema = {
//         type: "array",
//         items: {
//             type: "object",
//             properties: {
//                 fact: { type: "string", description: "A single interesting fact, 2-3 sentences long." }
//             }
//         }
//     };

//     // Define the System Instruction
//     const systemInstruction = `
//         You are an expert digital historian for a legends archive. Your sole purpose is to
//         uncover and provide obscure, little-known, and interesting facts about the given subject.
//         Each fact must be 2-3 sentences long and focus on non-mainstream details like current
//         activities, hidden biographical facts, or little-known history.
//         The output MUST strictly adhere to the provided JSON schema.
//     `;

//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             // The prompt is the 'contents'
//             contents: prompt,
//             config: {
//                 // *** NEW: Add the systemInstruction here ***
//                 systemInstruction: systemInstruction, 
                
//                 // Existing structured output parameters
//                 responseMimeType: "application/json",
//                 responseSchema: FactsArraySchema,
//             },
//         });
        
//         // ... (rest of your response handling code)

//     } catch (error) {
//         // ... (error handling)
//     }
// });
