import geminiResponse from "../gemini.js"; 
import User from "../models/user.model.js"; 
import moment from "moment"; 
import axios from "axios";

// ---  CURRENT USER ---
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: "Get current user error" });
    }
};


export const updateAssistant = async (req, res) => {
    try {
        const { name, assistantName, assistantImage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, assistantName, assistantImage },
            { new: true }
        ).select("-password");

        return res.status(200).json(user);
    } catch (error) {
        console.log("Backend Update Error:", error);
        return res.status(400).json({ message: "Update assistant error" });
    }
};


export const searchYoutube = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query required" });

        
        const instances = [
            "https://pipedapi.kavin.rocks",
            "https://piped-api.privacy.com.de",
            "https://api.piped.spot.sjv.io",
            "https://pipedapi.drgns.space"
        ];

        let videoId = null;

        for (const instance of instances) {
            try {
               
                const apiUrl = `${instance}/search?q=${encodeURIComponent(query)}&filter=music_videos`;
                const response = await axios.get(apiUrl, { timeout: 2000 });

                if (response.data && response.data.items && response.data.items.length > 0) {
                    videoId = response.data.items[0].url.split("v=")[1];
                    // console.log(`Success on ${instance}. Video ID: ${videoId}`);
                    break; 
                }
            } catch (err) {
               
                continue;
            }
        }

        if (videoId) {
            return res.status(200).json({ videoId });
        } else {
            return res.status(404).json({ message: "No video found on any server" });
        }

    } catch (error) {
        console.error("Critical Server Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


export const askToAssistant = async (req, res) => {
    try {
        const { prompt, history } = req.body; 
        const user = await User.findById(req.userId);
        
      
        if (user) {
            user.history.push(prompt);
            await user.save();
        }

        const userName = user?.name || "User";
        const assistantName = user?.assistantName || "Jarvis";

       
        const result = await geminiResponse(prompt, history, assistantName, userName);

     

      
        if (!result || typeof result !== "string") {
            return res.status(400).json({
                message: "Assistant returned invalid result",
                raw: result
            });
        }

      
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            
            return res.status(200).json({ 
                type: "general", 
                userinput: prompt,
                response: result 
            });
        }

        const gemResult = JSON.parse(jsonMatch[0]);

      
        switch (gemResult.type) {
            
            case "general":
                return res.status(200).json({
                    type: "general",
                    userinput: gemResult.userinput || prompt,
                    response: gemResult.response,
                });

            case "google_search":
                return res.status(200).json({
                    type: "google_search",
                    query: gemResult.query || gemResult.userinput, 
                    response: gemResult.response,
                });

            case "youtube_search":
                return res.status(200).json({
                    type: "youtube_search",
                    query: gemResult.userinput,
                    response: gemResult.response,
                });

            case "youtube_play":
                return res.status(200).json({
                    type: "youtube_play",
                    video: gemResult.video || gemResult.userinput, 
                    response: gemResult.response,
                });

            case "get_time":
                return res.status(200).json({
                    type: "get_time",
                    time: moment().format("hh:mm A"), 
                    response: gemResult.response,
                });

            case "get_date":
                return res.status(200).json({
                    type: "get_date",
                    date: moment().format("DD-MM-YYYY"), 
                    response: gemResult.response,
                });

            case "get_day":
                return res.status(200).json({
                    type: "get_day",
                    day: moment().format("dddd"),
                    response: gemResult.response,
                });

            case "get_month":
                return res.status(200).json({
                    type: "get_month",
                    month: moment().format("MMMM"),
                    response: gemResult.response,
                });

            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
                return res.status(200).json({
                    type: gemResult.type,
                    response: gemResult.response,
                });

            case "weather_show":
                return res.status(200).json({
                    type: "weather_show",
                    city: gemResult.city || gemResult.userinput,
                    response: gemResult.response,
                });

            default:
             
                return res.status(200).json({
                    type: "general",
                    response: gemResult.response || "I am not sure how to process that.",
                });
        }

    } catch (error) {
        console.error("AskToAssistant Controller Error:", error);
        res.status(500).send({ type: "general", response: "Something went wrong on the server." });
    }
};
