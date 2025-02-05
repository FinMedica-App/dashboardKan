import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/proxy";

const apiClient = axios.create({
  baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
