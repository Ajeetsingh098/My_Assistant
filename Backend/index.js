import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


const allowedOrigins = [
  "http://localhost:5173",                    
  "https://my-assistant-1-wnpr.onrender.com"  
];

app.use(cors({
  origin: function (origin, callback) {
  
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

/
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// --- 3. ROUTES ---
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.get("/", async (req, res) => {
  try {
    let prompt = req.query.prompt;
    if (!prompt) return res.send("Server is running. Send a prompt query param to test AI.");
    let data = await geminiResponse(prompt);
    res.json(data);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// --- 4. START SERVER ---
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
  connectdb();
});
