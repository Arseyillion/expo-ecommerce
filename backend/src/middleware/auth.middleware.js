import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";

import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(), // Clerk's requireAuth middleware
    async (req, res, next) => {
        try {
            // the app.use(clerkMiddleware()); which we added in server.js is what makes it possible for us to add the req.auth() method here
            const clerkId = req.auth().userId;
            if (!clerkId) { //if theres no user
                // return a status code of 401 which means unauthorized
                return res.status(401).json({ message: "Unauthorized -- invalid token" });
            }

            const user = await User.findOne({ clerkId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user; // attach the user to the request object for further use
            // what does next do here ? it tells express to move to the next middleware in line
            next();
        } catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(500).json({ message: "internal server error" });
        }
    }
];


export const adminOnly = (req, res, next) => {
    // to make this more secure we can check the email of the user against an admin email stored in our environment variables
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized -- user not found" });
    }

    if (req.user.email !== ENV.ADMIN_EMAIL) {
        // 403 means forbidden
        return res.status(403).json({ message: "forbidden -- admin access only" });
    }  
    next();
}     