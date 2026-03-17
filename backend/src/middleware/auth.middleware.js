import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";

import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(), // Clerk's requireAuth middleware
    async (req, res, next) => {
        try {
            // console.log(`\n🔐 === AUTH MIDDLEWARE START ===`);

            // console.log(`🔐 Request Method: ${req.method}`);

            // console.log(`🔐 Request URL: ${req.url}`);

            // console.log(`🔐 Full URL: ${req.protocol}://${req.get('host')}${req.url}`);

            // console.log(`🔐 Auth Header Present:`, !!req.headers.authorization);

            // console.log(`🔐 Auth Header:`, req.headers.authorization ? 'Bearer [TOKEN]' : 'none');

            
            // the app.use(clerkMiddleware()); which we added in server.js is what makes it possible for us to add the req.auth() method here
            const clerkId = req.auth().userId;
            // console.log(`🔐 Clerk ID from req.auth():`, clerkId);
            // console.log(`🔐 req.auth() full object:`, req.auth());
            
            if (!clerkId) { //if theres no user
                // console.log(`❌ AUTH FAILED: No clerk ID found`);
                // return a status code of 401 which means unauthorized
                return res.status(401).json({ message: "Unauthorized -- invalid token" });
            }

            // console.log(`🔐 Looking for user with clerkId: ${clerkId}`);
            const user = await User.findOne({ clerkId });
            // console.log(`🔐 User found in database:`, !!user);
            if (!user) {
                // console.log(`❌ AUTH FAILED: User not found in database`);
                return res.status(404).json({ message: "User not found" });
            }

            // console.log(`✅ AUTH SUCCESS: User authenticated - ${user.email}`);
            // console.log(`🔐 User object attached to req:`, { _id: user._id, email: user.email, clerkId: user.clerkId });
            req.user = user; // attach the user to the request object for further use
            // what does next do here ? it tells express to move to the next middleware in line
            // console.log(`🔐 === AUTH MIDDLEWARE END - Calling next() ===\n`);
            next();
        } catch (error) {
            console.error(`❌ AUTH MIDDLEWARE ERROR:`, error);
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