import express from "express"

import { askToAssistant, getCurrentUser, updateAssistant ,searchYoutube} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router()
userRouter.get("/youtube/search", searchYoutube);

userRouter.get('/current', isAuth, getCurrentUser)
userRouter.post('/update', isAuth, upload.single('assistantImage'), updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter
