import dotenv from "dotenv"

dotenv.config()

// created to be imported and used whenever we want to use any of the values below
export const ENV = {
    NODE_ENV:process.env.NODE_ENV,
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    CLERK_PUBLISHABLE_KEY:process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    INNGEST_SIGNING_KEY:process.env.INNGEST_SIGNING_KEY,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,   
    CLIENT_URL:process.env.CLIENT_URL,
}