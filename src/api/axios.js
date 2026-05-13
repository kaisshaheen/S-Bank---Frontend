import axios from "axios";

const api = axios.create({
    withCredentials: true,
    baseURL: "https://s-bank-backend-production.up.railway.app",
})

// IMPORTANT: ensure XSRF header is attached
api.interceptors.request.use((config) => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

    if (token) {
        config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }

    return config;
});

export default api