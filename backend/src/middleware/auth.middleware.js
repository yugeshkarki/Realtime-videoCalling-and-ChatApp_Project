import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({
//         message: "Unauthorized - no token provided",
//       });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     } catch (err) {
//       return res.status(401).json({
//         message: "Unauthorized - invalid token",
//       });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         message: "Unauthorized - user not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    console.log("=== protectRoute DEBUG ===");
    console.log("All cookies:", req.cookies);
    console.log("JWT token:", token);
    console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
    console.log("==========================");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
   

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
    
