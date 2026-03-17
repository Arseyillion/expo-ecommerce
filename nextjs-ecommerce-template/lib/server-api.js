import axios from "axios";
import { auth } from "@clerk/nextjs/server";

// Use environment variable for server-side
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Add response interceptor to handle errors properly
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Server API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

/**
 * Server-side API client with auth token
 * Use this in Server Components, API Routes, and Server Actions
 */
export const serverApi = async () => {
  const { getToken } = auth();
  const token = await getToken();

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000,
  });

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Server API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
      return Promise.reject(error);
    },
  );

  return instance;
};

/**
 * For API Routes where you have access to req object
 */
export const createApiFromReq = (req) => {
  const token = req.auth?.token;

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 60000,
  });

  return instance;
};
