import dotenv from "dotenv"

dotenv.config()

// created to be imported and used whenever we want to use any of the values below
export const ENV = {
    NODE_ENV:process.env.NODE_ENV,
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL
}