import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
/**
 * Middleware to protect routes by verifying JWT token.
 * If the token is valid, it attaches the user to the request object.
 * If not, it sends an appropriate error response.
 */

const protectRoute = async(req, res, next) => {
  try {
    const token= req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
};
export default protectRoute;
