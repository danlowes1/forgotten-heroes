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

// Get the API key from environment variables
// // const API_KEY = "AIzaSyDqQwicbZhHmyBtbMAgRZp3b6qDN5hwvzw" //process.env.GEMINI_API_KEY;
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const API_KEY = "AIzaSyDp3Nywb916n6Efwh4qu72dPI4yZBOo2dA"


// if (!API_KEY) {
//     console.error("GEMINI_API_KEY is not set in the environment variables.");
//     process.exit(1);
// }
// const ai = new GoogleGenerativeAI(API_KEY);

//gemini-1.5-pro
//gemini-2.5-flash
//gemini-2.0-flash-lite
app.get("/generate-ai-content", async (req, res) => {
    try {
        const response = await ai.getGenerativeModel({ model: "gemini-2.5-flash" }).generateContent({
            // 'contents' is an array of 'Content' objects
            contents: [{ 
                // Each 'Content' object must have a 'parts' array
                parts: [{ 
                    // The text of the prompt goes inside an object with the key 'text'
                    text: "Explain how AI works in a few words" 
                }]
            }],
        });


        res.json({ text: response.text });
    } catch (error) {
        console.error("Error generating content:", error);
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

        // const response = await ai.getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent({
        //     contents: [{ text: "Explain how AI works in a few words" }],
        // });

// // server.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config(); // Use .env to manage your API key

// Initialize the Express app
// const app = express();
// app.use(cors()); // This allows your frontend to make requests to this server
// app.use(express.json());

// Get the API key from environment variables
// const API_KEY = process.env.GEMINI_API_KEY;

// if (!API_KEY) {
//     console.error("GEMINI_API_KEY is not set in the environment variables.");
//     process.exit(1);
// }

// const ai = new GoogleGenerativeAI(API_KEY);

// app.get("/generate-ai-content", async (req, res) => {
//     try {
//         const response = await ai.getGenerativeModel({ model: "gemini-2.5-flash" }).generateContent({
//             contents: [{ text: "Explain how AI works in a few words" }],
//         });

//         res.json({ text: response.text });
//     } catch (error) {
//         console.error("Error generating content:", error);
//         res.status(500).json({ error: "Failed to generate AI content" });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
