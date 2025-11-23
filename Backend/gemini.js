import axios from "axios";


const geminiResponse = async (prompt, history = [], assistantName, userName) => {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

  
    const command = `
    You are a virtual assistant named "${assistantName}" created by "Ajeet Singh".
    User's Name: "${userName || "User"}".
    
    INSTRUCTIONS:
    1. If the user refers to previous context (e.g., "what is that?", "play it"), use the conversation history to understand.
    2. If the user asks a General Question (e.g., "Who is Elon musk?", "What is an atom?", "Tell me a joke"), return type "general" and provide the answer in the "response" field.
    3. ONLY return type "google_search" if the user EXPLICITLY uses words like "Search", "Google", "open google", "Find on web", or "Look up".
    
    Respond ONLY with raw JSON. No markdown.

    STRUCTURES:

    1) GOOGLE SEARCH (Only if explicitly asked):
    {
      "type": "google_search",
      "query": "<what to search>",
      "userinput": "${prompt}",
      "response": "Searching Google for <query>"
    }

    2) GENERAL ANSWER (Default for questions):
    {
      "type": "general",
      "userinput": "${prompt}",
      "response": "<Your direct answer to the question goes here>"
    }

    3) YOUTUBE (Search or Play):
    {
      "type": "youtube_search" | "youtube_play",
      "video": "<video name>",
      "userinput": "${prompt}",
      "response": "Opening YouTube"
    }

    4) WEATHER:
    {
      "type": "weather_show",
      "city": "<city>",
      "userinput": "${prompt}",
      "response": "Checking weather"
    }

    5) DATE/TIME:
    {
      "type": "get_date" | "get_time",
      "userinput": "${prompt}",
      "response": "" 
    }
    
    6) APPS:
    {
      "type": "instagram_open" | "facebook_open" | "calculator_open",
      "userinput": "${prompt}",
      "response": "Opening app"
    }

    Now process: "${prompt}"
    `;

   
    const contents = [
        ...history, 
        {
            role: "user",
            parts: [{ text: command }] 
        }
    ];

    const payload = { contents: contents };
    
    try {
        const res = await axios.post(`${apiUrl}?key=${apiKey}`, payload, { headers: { "Content-Type": "application/json" } });
        const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const clean = text.replace(/```json|```/g, "").trim();
        return clean;
    } catch (err) {
     
        console.error("Gemini API Error:", err.response?.data || err.message);
        return JSON.stringify({ 
            type: "general", 
            response: "I am having trouble connecting to my brain right now.",
            error: err.message 
        });
    }
}

export default geminiResponse;
