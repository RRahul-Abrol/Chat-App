import express from "express";
import{login ,logout,signup} from "../controllers/auth.controllers.js";
const router =express.Router();
//import protectRoute from "../middleware/protectRoute.js"; // <<< ADD THIS IMPORT


router.post("/signup",signup);
router.post("/login",login);
//router.post("/logout", protectRoute, logout); // <<< ADD protectRoute HERE

export default router;