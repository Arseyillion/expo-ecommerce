import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";
import { Platform } from "react-native";


const getBaseUrl = () => {
  if (__DEV__) {  // Only in development
    if (Platform.OS === "ios") {
      return "http://localhost:3000/api";
    } else if (Platform.OS === "android") {
      // Special alias for Android emulator to reach host machine
      return "http://192.168.43.94:3000/api";
    }
  }
  // In production, use your real deployed URL
  // return "https://your-production-api.com/api";
};

const API_URL = "https://expo-ecommerce-1v13.onrender.com/api"
// FORMERLLY getBaseUrl()

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // 20 seconds
});

export const useApi = () => {
  // Extract `getToken` function from Clerk's useAuth hook.
  // getToken is an async function that retrieves the current user's auth token.
  const { getToken } = useAuth();
  console.log("useApi called, getToken:", getToken);

  // useEffect runs when the hook is mounted and whenever `getToken` changes.
  useEffect(() => {
    // Add an Axios request interceptor.
    // Interceptors let you modify every request before it is sent.
    const interceptor = api.interceptors.request.use(async (config) => {
      // Get the auth token from Clerk
      const token = await getToken();

      // If a token exists, attach it to the Authorization header
      // This ensures all requests are authenticated
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Must return the config object for Axios to proceed with the request
      return config;
    });

    // Cleanup function: remove the interceptor when the component using this hook unmounts
    // Prevents multiple interceptors from stacking up if the hook is used multiple times
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]); // Dependency array: run effect again if getToken changes

  // Return the Axios instance with the interceptor attached
  // Any component using this hook can now make authenticated API requests
  return api;
};
// on every single req, we would like have an auth token so that our backend knows that we're authenticated
// we're including the auth token under the auth headers