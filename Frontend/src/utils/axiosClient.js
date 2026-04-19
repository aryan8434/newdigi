import axios from "axios";

const resolvedApiUrl = import.meta.env.VITE_API_URL;
const defaultApiUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

const axiosClient = axios.create({
  baseURL:
    resolvedApiUrl &&
    !resolvedApiUrl.includes("localhost") &&
    !resolvedApiUrl.includes("127.0.0.1")
      ? resolvedApiUrl
      : defaultApiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
