import axios from "axios";

// important
/*
    withCredentials: true,

    This is extremely important and commonly misunderstood.

What it does:Sends cookies along with every request
Enables:
Session-based auth
HttpOnly cookies
CSRF-protected authentication
Without this:
Your backend may authenticate you
But the browser won't send the session cookie
Result: "Why am I always logged out?" bugs
*/

// Use NEXT_PUBLIC_API_URL for client-side Next.js env var. Fall back to '/api'
// so requests like `/products/...` become `/api/products/...` on the same origin.
const baseURL = process.env.NEXT_PUBLIC_API_URL 

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Add response interceptor to handle errors properly
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't swallow errors - just log and return the error so components can handle it
    console.error("API Error:", error.message, {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
