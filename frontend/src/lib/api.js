import axios from "axios";

// Railway Environment Variable
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://teampill-production.up.railway.app";

// API Base URL
export const API_BASE = `${BACKEND_URL}/api`;

// Debug (Check browser console)
console.log("Backend URL:", BACKEND_URL);
console.log("API Base:", API_BASE);

// Axios Instance
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Error Formatter
export function formatApiError(detail) {
  if (!detail) return "Something went wrong.";

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "object" && item.msg
          ? item.msg
          : JSON.stringify(item)
      )
      .join(", ");
  }

  if (typeof detail === "object" && detail.msg) {
    return detail.msg;
  }

  return String(detail);
}

export default api;
