import { response } from "express";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment/moment.js";
import axios from "axios";

export const getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
         return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant = async (req, res) => {
    try {
        
        const { name, assistantName, assistantImage } = req.body;

        // 2. Update the User
        const user = await User.findByIdAndUpdate(
            req.userId, 
            { 
                name,        
                assistantName,  
                assistantImage
            }, 
            { new: true }       
        ).select("-password");

        return res.status(200).json(user);

    } catch (error) {
        console.log("Backend Update Error:", error);
        return res.status(400).json({ message: "update assistant error" });
    }
}

export const searchYoutube = async (req, res) => {
    try {
        const { query } = req.query; 

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

      
        const apiUrl = `https://piped-api.privacy.com.de/search?q=${encodeURIComponent(query)}&filter=music_videos`;

        const response = await axios.get(apiUrl);

        if (response.data && response.data.items && response.data.items.length > 0) {
            const firstVideo = response.data.items[0];
          
            const videoId = firstVideo.url.split("v=")[1];

            return res.status(200).json({ videoId });
        } else {
            return res.status(404).json({ message: "No video found" });
        }

    } catch (error) {
        console.error("YouTube Search Error:", error.message);
        return res.status(500).json({ message: "Server Error fetching video" });
    }
};






export const askToAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(prompt)
    user.save()
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(prompt, assistantName, userName);
   console.log("GEMINI RAW RESULT:", result);

// -------- SAFE CHECK --------
if (!result || typeof result !== "string") {
  return res.status(400).json({
    message: "Assistant returned invalid result",
    raw: result
  });
}
    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);

    switch (gemResult.type) {
     
      case "general":
        return res.status(200).json({
          type: "general",
          userinput: gemResult.userinput,
          response: gemResult.response,
        });

     
      case "google_search":
        return res.status(200).json({
          type: "google_search",
          query: gemResult.userinput,
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
          video: gemResult.userinput,
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
        return res.status(200).json({
          type: "calculator_open",
          response: gemResult.response,
        });

      
      case "instagram_open":
        return res.status(200).json({
          type: "instagram_open",
          response: gemResult.response,
        });

      
      case "facebook_open":
        return res.status(200).json({
          type: "facebook_open",
          response: gemResult.response,
        });

      
      case "weather_show":
        return res.status(200).json({
          type: "weather_show",
          city: gemResult.userinput,
          response: gemResult.response,
        });

     
      default:
        return res.status(400).json({
          message: "Unknown assistant command",
        });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({ message: "askToAssistant error" });
  }
};
