import axios from "axios";

const api = axios.create({
    baseURL: "https://s-bank-backend-production.up.railway.app",
    withCredentials: true,
    withXSRFToken: true,

    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
});

// 🔥 THIS IS THE MISSING PIECE
// api.interceptors.request.use((config) => {
//     const token = document.cookie
//         .split("; ")
//         .find(row => row.startsWith("XSRF-TOKEN="))
//         ?.split("=")[1];

//     if (token) {
//         config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
//     }

//     return config;
// });

export default api;