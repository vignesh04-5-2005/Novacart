import axios from "axios";

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved login token to protected API requests.
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // Clear malformed local data instead of breaking every API request.
    localStorage.removeItem("user");
  }

  return config;
});

// Prefer the backend's message so pages can show useful error feedback.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (!error.response) {
      error.message = "Unable to reach the server. Check your connection and API URL.";
    }

    return Promise.reject(error);
  },
);

export default api;
