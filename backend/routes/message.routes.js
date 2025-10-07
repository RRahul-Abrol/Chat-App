import express from "express";
import { getMessages,sendMessage } from "../controllers/message.controller.js";
import  protectRoute  from "../middleware/protectRoute.js";

const router=express.Router();
router.get("/:id",protectRoute,getMessages); // Assuming you want to get messages for a specific conversation
router.post("/send/:id",protectRoute,sendMessage);


export default router;