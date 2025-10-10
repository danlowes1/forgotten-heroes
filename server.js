// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const sequelize = require("./config/connection");
const routes = require("./routes"); // Main router index.js
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST"],
}));

// AI key + Gemini setup
const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Gemini AI endpoint ---
app.get("/generate-ai-content", async (req, res) => {
  const heroName = req.query.heroName;

  if (!heroName) return res.status(400).json({ error: "Missing 'heroName' query parameter." });

  const prompt = `
    Give me up to 5 interesting facts about ${heroName}.
    Each fact should be 2-3 sentences long.
  `;

  const FactsArraySchema = {
    type: "array",
    items: {
      type: "object",
      properties: { fact: { type: "string" } }
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

    const factsArray = JSON.parse(response.text).map(item => item.fact);
    res.json(factsArray);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate AI content" });
  }
});

// --- Static files ---
app.use(express.static(path.join(__dirname, "public")));

// --- Use main router for API ---
app.use("/api", routes);

// --- Root page ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// --- Sync + start ---
const rebuild = process.argv[2] === "--rebuild";
sequelize.sync({ force: rebuild }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
