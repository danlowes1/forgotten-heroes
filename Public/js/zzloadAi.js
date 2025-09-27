// const { GoogleGenAI } = require("@google/genai"); // Import correctly

// // Initialize the AI client. It automatically looks for the GEMINI_API_KEY
// // environment variable, or you can pass { apiKey: "YOUR_API_KEY" }
// // const ai = new GoogleGenAI({});


// // 1. Get your API key (e.g., from your .env or a secure configuration)
// const API_KEY = "AIzaSyDp3Nywb916n6Efwh4qu72dPI4yZBOo2dA";

// // 2. Pass the key into the constructor
// const ai = new GoogleGenAI({ apiKey: API_KEY });



// async function run() {
//     const prompt = "Explain how AI works in a few words";

//     // NOTE: The modern SDK uses model.generateContent, not ai.models.generateContent
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//     });

//     console.log("Response text:", response.text);
//     // You can also log the full response if you want more details, but it's often large.
//     // console.log("Full response object:", JSON.stringify(response, null, 2));
// }




async function run() {

    const { GoogleGenAI } = require("@google/genai"); // Import correctly
    const API_KEY = "AIzaSyDp3Nywb916n6Efwh4qu72dPI4yZBOo2dA";
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = "Explain how AI works in a few words";

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("Response text:", response.text);

}


run();
