import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectdb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"
import bodyParser from "body-parser"

const app=express()
app.use(cors({
origin:process.env.FRONTEND_URL,
credentials:true
}))

const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/",async (req,res)=>{
let prompt=req.query.prompt
let data=await geminiResponse(prompt)
res.json(data)
})




app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.listen(port,()=>{
   
    console.log(`server running at http://localhost:${port}`)
     connectdb()
})